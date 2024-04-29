from flask_restful import Resource
from flask import request, jsonify
from main.models import BookModel
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
        books = db.session.query(BookModel).all()
        return jsonify([book.to_json() for book in books])
    
    def post(self):
        book = BookModel.from_json(request.get_json())
        try:
            db.session.add(book)
            db.session.commit()
        except:
            return 'Incorrect data format', 400
        return book.to_json(), 201