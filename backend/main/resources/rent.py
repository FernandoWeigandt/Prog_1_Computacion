from flask_restful import Resource
from flask import request

# Test JSON Data

RENTS = {
    1:{'book_rented':'book1', 'time':1},
    2:{'book_rented':'book2', 'time':2},
    3:{'book_rented':'book3', 'time':0},
    4:{'book_rented':'book4', 'time':0},
}

class Rent(Resource):
    def get(self, id):
        if int(id) in RENTS:
            return RENTS[int(id)]
        return 'Id not found', 404
    
    def delete(self, id):
        if int(id) in RENTS:
            del RENTS[int(id)]
            return '', 204
        return 'Id not found', 404
    
    def put(self, id):
        if int(id) in RENTS:
            rent = RENTS[int(id)]
            data = request.get_json()
            rent.update(data)
            return '', 201
        return 'Id not found', 404
    
class Rents(Resource):
    def get(self):
        return RENTS
    
    def post(self):
        rent = request.get_json()
        id = int(max(RENTS.keys())) + 1
        RENTS[id] = rent
        return RENTS[id], 201