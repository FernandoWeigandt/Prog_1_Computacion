from flask_restful import Resource
from flask import request, jsonify
from main.models import BookModel, AuthorModel
from main.auth.decorators import role_required
from flask_jwt_extended import jwt_required
from .. import db

class Book(Resource):
    def get(self, id):
        """
        Handles GET requests to retrieve a book by id.

        Retrieves a book from the database matching the provided id. If found,
        the book is converted to JSON format and returned in a JSON response.
        If not found, a 404 status code is returned.
        """
        book = db.session.query(BookModel).get_or_404(id)
        return book.to_json_complete()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self, id):
        """
        Handles DELETE requests to remove a book by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The requested book is removed from the database. If the deletion is successful, a JSON 
        representation of the book is returned with a 200 status code. If an error occurs during processing,
        an error message is returned with a 400 status code.
        """
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
        if data.get('authors'):
            authors = AuthorModel.query.filter(AuthorModel.id.in_(data.get('authors'))).all()
            book.authors = authors
        try:
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Unable to update the book'}, 400
        return book.to_json() , 200
    
class Books(Resource):
    def get(self):
        """
        Handles GET requests to obtain a list of books.

        The request parameters can be used to filter the results. The following
        parameters are accepted:
        - page: the page number to retrieve. Default is 1.
        - per_page: the number of items per page. Default is 10.
        - id: filter books by id.
        - title: filter books by title.
        - gender: filter books by gender.

        The response will contain a JSON object with the following structure:
        - books: an array of book objects, each with the structure returned by the to_json() method.
        - total: the total number of books.
        - pages: the total number of pages.
        - page: the current page number.

        The books will be sorted by status and rating, with the available books first.
        """
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
        """
        Handles POST requests to create a new book.

        Requires a valid JWT token for authentication and allows roles: admin, librarian.

        Request Body:
        - title: the title of the book.
        - gender: the gender of the book.
        - image: the image of the book.
        - description: the description of the book.
        - authors: an array of authors id.

        Returns a JSON object with the new book data and a 201 status code.
        If there is an error, it returns a JSON object with an error message and a 400 status code.
        """
        try:
            book = BookModel.from_json(request.get_json())
            db.session.add(book)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return book.to_json(), 201