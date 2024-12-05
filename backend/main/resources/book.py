from flask_restful import Resource
from flask import request, jsonify
from main.models import BookModel, AuthorModel
from main.auth.decorators import role_required
from flask_jwt_extended import jwt_required
from .. import db

class Book(Resource):
    def get(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        return book.to_json_complete()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        try:
            db.session.delete(book)
            db.session.commit()
        except:
            return {'error':'Unable to delete the book'}, 400
        return book.to_json(), 200
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def put(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        data = request.get_json()
        if data.get('title'):
            book.title = data.get('title')
        if data.get('gender'):
            book.gender = data.get('gender')
        if data.get('image'):
            book.image = data.get('image')
        if data.get('description'):
            book.description = data.get('description')
        try:
            if "authors" in data:
                for author in book.authors.all():
                    book.authors.remove(author)
                for author in data.get("authors"):
                    author = AuthorModel.query.get(author)
                    book.authors.append(author) if author else None
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Unable to update the book'}, 400
        return book.to_json() , 200
    
class Books(Resource):
    def get(self):
        page = 1
        per_page = 10
        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # This will bring all the books in the database, so
        # if the data is big it will be a slow operation.
        # And if is too big it could cause a memory error.
        # Assuming that the number of books is small (less
        # than 5000) this will be a good solution, but this
        # is a temporary solution, it must migrate to a 
        # SQLAlchemy annotation which will be faster.
        books = db.session.query(BookModel).all()  

        if request.args.get('id'):
            books = [book for book in books if book.id == int(request.args.get('id'))]
        if request.args.get('title'):
            books = [book for book in books if request.args.get('title').lower() in book.title.lower()]
        if request.args.get('gender'):
            books = [book for book in books if request.args.get('gender').lower() in book.gender.lower()]

        # Sort books by status and rating
        books = sorted(books, key=lambda book: (book.status != 'available', -book.rating))

        start = (page - 1) * per_page
        end = start + per_page
        books_paginated = books[start:end]

        return jsonify({
            'books': [book.to_json() for book in books_paginated],
            'total': len(books),
            'pages': (len(books) + per_page - 1) // per_page,
            'page': page
        })

    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def post(self):
        try:
            book = BookModel.from_json(request.get_json())
            authors_id = request.get_json().get('authors')
            if authors_id:
                authors = []
                for author in authors_id:
                    authors.append(AuthorModel.query.get_or_404(author))
                book.authors.extend(authors)
            db.session.add(book)
            db.session.commit()
        except Exception as e:
            print(str(e))
            return {'error':'Incorrect data format'}, 400
        return book.to_json(), 201