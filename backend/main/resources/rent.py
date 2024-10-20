from flask_restful import Resource
from flask import request, jsonify
from main.models import RentModel, BookCopyModel, UserModel
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
        data = RentModel.from_json_attr(request.get_json())
        if data.get('init_date'):
            rent.init_date = datetime.strptime(data['init_date'], '%Y-%m-%d')
        if data.get('expiration_date'):
            rent.expiration_date = datetime.strptime(data['expiration_date'], '%Y-%m-%d')
        if data.get('user_id'):
            user = db.session.query(UserModel).get(data.get('user_id'))
            if not user:
                return {'error':'User not found'}, 404
            rent.user_id = user.id
        if data.get('book_copy_id'):
            book_copy = db.session.query(BookCopyModel).get(data.get('book_copy_id'))
            if not book_copy:
                return {'error':'Book copy not found'}, 404
            rent.book_copy_id = book_copy.id
        try:
            db.session.commit()
        except:
            db.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json() , 200
    
class Rents(Resource):
    def get(self):
        rents = db.session.query(RentModel).all()
        return jsonify([rent.to_json_complete() for rent in rents])
    
    def post(self):
        data = request.get_json()
        user = db.session.query(UserModel).get(data.get('user_id'))
        if not user:
            return {'error':'User not found'}, 404
        book_copy = db.session.query(BookCopyModel).get(data.get('book_copy_id'))
        if not book_copy:
            return {'error':'Book copy not found'}, 404
        rent = RentModel.from_json(data)
        try:
            db.session.add(rent)
            db.session.commit()
        except:
            db.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json(), 201