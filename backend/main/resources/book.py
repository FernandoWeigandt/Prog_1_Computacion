from flask_restful import Resource
from flask import request

# Test JSON Data

BOOKS = {
    1:{'name':'book1', 'category':'cience'},
    2:{'name':'book2', 'category':'humor'},
    3:{'name':'book3', 'category':'fantacy'},
    4:{'name':'book4', 'category':'drama'},
}

class Book(Resource):
    def get(self, id):
        if int(id) in BOOKS:
            return BOOKS[int(id)]
        return 'Id not found', 404
    
    def delete(self, id):
        if int(id) in BOOKS:
            del BOOKS[int(id)]
            return '', 204
        return 'Id not found', 404
    
    def put(self, id):
        if int(id) in BOOKS:
            book = BOOKS[int(id)]
            data = request.get_json()
            book.update(data)
            return '', 201
        return 'Id not found', 404
    
class Books(Resource):
    def get(self):
        return BOOKS
    
    def post(self):
        book = request.get_json()
        id = int(max(BOOKS.keys())) + 1
        BOOKS[id] = book
        return BOOKS[id], 201