from flask_restful import Resource
from flask import request, jsonify
from main.models import BookModel, AuthorModel
from sqlalchemy import func, desc, asc
from .. import db

class Book(Resource):
    def get(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        return book.to_json_complete()
    
    def delete(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        try:
            db.session.delete(book)
            db.session.commit()
        except:
            return 'Incorrect data format', 400
        return book.to_json(), 204
    
    def put(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(book, key, value)
        try:
            db.session.add(book)
            db.session.commit()
        except:
            return 'Incorrect data format', 400
        return book.to_json() , 201
    
class Books(Resource):
    def get(self):
        # Default start page
        page = 1
        # Default pages quantity
        per_page = 10
        
        books = db.session.query(BookModel)
        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # Filters #

        if request.args.get('id'):
            books=books.filter(BookModel.id.like('%'+request.args.get('id')+'%'))

        if request.args.get('title'):
            books=books.filter(BookModel.title.like('%'+request.args.get('title')+'%'))

        if request.args.get('gender'):
            books=books.filter(BookModel.gender.like('%'+request.args.get('gender')+'%'))

        if request.args.get('publisher'):
            books=books.filter(BookModel.publisher.like('%'+request.args.get('publisher')+'%'))

        if request.args.get('status'):
            books=books.filter(BookModel.status == request.args.get('status'))

        # Sort by #

        if request.args.get('valorations'):
            if request.args.get('valorations') == "asc":
                books=books.outerjoin(BookModel.valorations).group_by(BookModel.id).order_by(func.count(ValorationModel.valoration).asc())
            elif request.args.get('valorations') == "desc":
                books=books.outerjoin(BookModel.valorations).group_by(BookModel.id).order_by(func.count(ValorationModel.valoration).desc())
            else:
                return {"message": "Invalid sort order"}, 400

        if request.args.get('sortby_nrRents'):
            if request.args.get('sortby_nrRents') == "asc":
                books=books.outerjoin(BookModel.rents).group_by(BookModel.id).order_by(func.count(RentModel.id).asc())
            if request.args.get('sortby_nrRents') == "desc":
                books=books.outerjoin(BookModel.rents).group_by(BookModel.id).order_by(func.count(RentModel.id).desc())


        books = books.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({
            'books': [book.to_json_complete() for book in books],
            'total': books.total,
            'pages': books.pages,
            'page': page            
        })
    
    def post(self):
        authors_id = request.get_json().get('authors')
        book = BookModel.from_json(request.get_json())
        if authors_id:
            authors = AuthorModel.query.filter(AuthorModel.id.in_(authors_id)).all()
            book.authors.extend(authors)
        try:
            db.session.add(book)
            db.session.commit()
        except:
            return 'Incorrect data format', 400
        return book.to_json(), 201