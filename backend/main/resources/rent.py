from flask_restful import Resource
from main.models import RentModel, BookCopyModel, UserModel, BookModel
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from flask import request, jsonify
from sqlalchemy import asc, desc
from .. import db

class Rent(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def get(self, id):
        rents = db.session.query(RentModel).get_or_404(id)
        return rents.to_json_complete()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def delete(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        # User request verification
        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role
        if current_identity == rent.user_id or role == 'admin':
            try:
                db.session.delete(rent)
                db.session.commit()
            except:
                return {'error':'Incorrect data format'}, 400
        else:
            return {'error':'Unauthorized'}, 401
        return rent.to_json(), 204
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def put(self, id):
        rent = db.session.query(RentModel).get_or_404(id)
        # Gen data from request
        data = RentModel.from_json_attr(request.get_json())
        # Parse dates for mathing format expected
        if data.get('init_date'):
            rent.init_date = datetime.strptime(data['init_date'], '%Y-%m-%d')
        if data.get('expiration_date'):
            rent.expiration_date = datetime.strptime(data['expiration_date'], '%Y-%m-%d')
        # Verify user and book_copy copy exist
        if data.get('user_id'):
            user = db.session.query(UserModel).get_or_404(data.get('user_id'))
            rent.user_id = user.id
        if data.get('book_copy_id'):
            book_copy = db.session.query(BookCopyModel).get_or_404(data.get('book_copy_id'))
            rent.book_copy_id = book_copy.id
        # Update rent
        try:
            db.session.commit()
        except:
            db.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json() , 200
    
class Rents(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def get(self):
        page = 1
        per_page = 10
        rents = db.session.query(RentModel)
        
        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # Global filters (for all roles except pending)
        # this will return newer rents by default
        rents = rents if request.args.get('old') else rents.order_by(desc(RentModel.id))

        # When a user request rents, only its rents are returned
        if role == 'user':
            rents = rents.filter(RentModel.user_id == current_identity)

        # filters for admin and librarian roles
        if role == 'admin' or role == 'librarian':
            if request.args.get('user_id'):
                rents=rents.filter(RentModel.user_id == request.args.get('user_id'))
            if request.args.get('user_name'):
                rents=rents.join(UserModel).filter(UserModel.name.like('%'+request.args.get('user_name')+'%'))
            if request.args.get('book_copy_id'):
                rents=rents.filter(RentModel.book_copy_id == request.args.get('book_copy_id'))
            if request.args.get('book_title'):
                rents = rents.join(BookCopyModel, RentModel.book_copy_id == BookCopyModel.id).join(BookModel, BookCopyModel.book_id == BookModel.id).filter(BookModel.title.like('%' + request.args.get('book_title') + '%'))
            if request.args.get('init_date'):
                rents=rents.filter(RentModel.init_date == request.args.get('init_date'))
            if request.args.get('expiration_date'):
                rents=rents.filter(RentModel.expiration_date == request.args.get('expiration_date'))
        
        rents = rents.paginate(page=page, per_page=per_page, error_out=True)
        return jsonify({
            'rents': [rent.to_json() for rent in rents],
            'total': rents.total,
            'pages': rents.pages,
            'page': page    
        })
    
    @jwt_required()
    @role_required(roles=['user', 'librarian', 'admin'])
    def post(self):
        data = request.get_json()
        # Verify user and book copy exist
        db.session.query(UserModel).get_or_404(data.get('user_id'))
        db.session.query(BookCopyModel).get_or_404(data.get('book_copy_id'))
        try:
            rent = RentModel.from_json(data)
            db.session.add(rent)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json(), 201