from flask_restful import Resource
from flask import request, jsonify
from main.models import RentModel, BookModel 
from .. import db
from datetime import datetime

class Rent(Resource):
    def get(self, id):
        rents = db.session.query(RentModel).get_or_404(id)
        return rents.to_json_complete()
    
    def delete(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        try:
            db.session.delete(rent)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return rent.to_json(), 204
    
    def put(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        data = RentModel.from_json_attr(request.get_json()).items()
        for key, value in data:
            if key != 'id':
                value = datetime.strptime(value, '%Y-%m-%d')
            setattr(rent, key, value)
        try:
            db.session.add(rent)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return rent.to_json() , 201 
    
class Rents(Resource):
    def get(self):
        rents = db.session.query(RentModel).all()
        return jsonify([rent.to_json() for rent in rents])
    
    def post(self):
        books_id = request.get_json().get('books')
        rent = RentModel.from_json(request.get_json())
        try:
            db.session.add(rent)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return rent.to_json(), 201