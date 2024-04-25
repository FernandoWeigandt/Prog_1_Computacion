from flask_restful import Resource
from flask import request, jsonify
from main.models import RentModel
from .. import db

# Test JSON Data

RENTS = {
    1:{'book_rented':'book1', 'time':1},
    2:{'book_rented':'book2', 'time':2},
    3:{'book_rented':'book3', 'time':0},
    4:{'book_rented':'book4', 'time':0},
}

class Rent(Resource):
    def get(self, id):
        rents = db.session.query(RentModel).get_or_404(id)
        return rents.to_json()
    
    def delete(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        db.session.delete(rent)
        db.session.commit()
        return rent.to_json(), 204
    
    def put(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(rent, key, value)
        db.session.add(rent)
        db.session.commit()
        return rent.to_json() , 201 
    
class Rents(Resource):
    def get(self):
        rents = db.session.query(RentModel).all()
        return jsonify([rent.to_json() for rent in rents])
    
    def post(self):
        rent = RentModel.from_json(request.get_json())
        db.session.add(rent)
        db.session.commit()
        return rent.to_json(), 201