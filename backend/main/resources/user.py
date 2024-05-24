from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from .. import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required

class User(Resource):
    @jwt_required(optional=True)
    def get(self, id):
        user = db.session.query(UserModel).get_or_404(id)
        return user.to_json_complete()

        current_identity = get_jwt_identity()
        if current_identity:
            return user.to_json_complete()
        else:
            return user.to_json_short()
    
    @role_required(roles=['admin', 'user'])
    def delete(self, id):
        user = db.session.query(UserModel).get_or_404(id)
        try:
            db.session.delete(user)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return user.to_json(), 204
    
    @jwt_required()
    def put(self, id):
        user = db.session.query(UserModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(user, key, value)
        try:
            db.session.add(user)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return user.to_json() , 201 

class Users(Resource):
    @role_required(roles=['admin'])
    def get(self):
        # Default start page
        page = 1
        # Default pages quantity
        per_page = 10
        
        users = db.session.query(UserModel)
        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # Filters #

        if request.args.get('name'):
            users=users.filter(UserModel.name.like('%'+request.args.get('name')+'%'))

        if request.args.get('lastname'):
            users=users.filter(UserModel.lastname.like('%'+request.args.get('lastname')+'%'))

        if request.args.get('mail'):
            users=users.filter(UserModel.mail.like('%'+request.args.get('mail')+'%'))

        if request.args.get('phone'):
            users=users.filter(UserModel.phone.like('%'+request.args.get('phone')+'%'))

        if request.args.get('rol'):
            users=users.filter(UserModel.rol.like('%'+request.args.get('rol')+'%'))

        if request.args.get('alias'):
            users=users.filter(UserModel.alias.like('%'+request.args.get('alias')+'%'))

        if request.args.get('rent'):
            users=users.filter(UserModel.rent.like('%'+request.args.get('rent')+'%'))
        
        # Sort by #

        if request.args.get('sortby_name'):
            if request.args.get('sortby_name') == "asc":
                users=users.order_by(asc(UserModel.name))
            if request.args.get('sortby_name') == "desc":
                users=users.order_by(desc(UserModel.name))

        if request.args.get('sortby_lastname'):
            if request.args.get('sortby_lastname') == "asc":
                users=users.order_by(asc(UserModel.lastname))
            if request.args.get('sortby_lastname') == "desc":
                users=users.order_by(desc(UserModel.lastname))

        if request.args.get('sortby_valoration'):
            if request.args.get('sortby_valoration') == "asc":
                users=users.order_by(asc(UserModel.valoration))
            if request.args.get('sortby_valoration') == "desc":
                users=users.order_by(desc(UserModel.valoration))

        users = users.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({
            'users': [user.to_json() for user in users],
            'total': users.total,
            'pages': users.pages,
            'page': page            
        })
    
    # This shouldn't be uncommented
    # def post(self):
    #     user = UserModel.from_json(request.get_json())
    #     try:
    #         db.session.add(user)
    #         db.session.commit()
    #     except:
    #         return {'error':'Incorrect data format'}, 400
    #     return user.to_json(), 201