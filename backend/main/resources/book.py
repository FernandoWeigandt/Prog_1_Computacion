from flask_restful import Resource
from flask import request, jsonify
from main.models import BookModel
from .. import db

# Test JSON Data

BOOKS = {
    1:{'name':'book1', 'category':'cience'},
    2:{'name':'book2', 'category':'humor'},
    3:{'name':'book3', 'category':'fantacy'},
    4:{'name':'book4', 'category':'drama'},
}

class Book(Resource):
    def get(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        return book.to_json()
    
    def delete(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        db.session.delete(book)
        db.session.commit()
        return book.to_json(), 204
    
    def put(self, id):
        book = db.session.query(BookModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(book, key, value)
        db.session.add(book)
        db.session.commit()
        return book.to_json() , 201
    
class Books(Resource):
    def get(self):
        books = db.session.query(BookModel).all()
        return jsonify([book.to_json() for book in books])
    
    def post(self):
        book = BookModel.from_json(request.get_json())
        db.session.add(book)
        db.session.commit()
        return book.to_json(), 201