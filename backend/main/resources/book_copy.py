from flask import request, jsonify
from flask_restful import Resource
from main.models import BookCopyModel, BookModel
from .. import db

class BookCopy(Resource):
    def get(self, id):
        book_copy = db.session.query(BookCopyModel).get_or_404(id)
        return book_copy.to_json()
    
    def put(self, id):
        book_copy = db.session.query(BookCopyModel).get_or_404(id)
        data = request.get_json().items()
        try:
            for key, value in data:
                setattr(book_copy, key, value)
            db.session.add(book_copy)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return book_copy.to_json() , 201
    
    def delete(self, id):
        book_copy = db.session.query(BookCopyModel).get_or_404(id)
        try:
            db.session.delete(book_copy)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return book_copy.to_json()

    
class BookCopies(Resource):
    def get(self):
        books = db.session.query(BookCopyModel).all()
        return jsonify([book.to_json() for book in books])

    def post(self):
        try:
            data = request.get_json()
            db.session.query(BookModel).get_or_404(data.get('book_id'))
            book_copy = BookCopyModel.from_json(data)
            db.session.add(book_copy)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return book_copy.to_json(), 201