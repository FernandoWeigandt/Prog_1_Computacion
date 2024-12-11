from flask_restful import Resource
from flask import request, jsonify
from main.models import UserModel
from sqlalchemy import asc, desc
from .. import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required

class User(Resource):
    @jwt_required()
    def get(self, id):
        """
        Handles GET requests to obtain a user.

        Requires a valid JWT token for authentication. Returns a JSON representation
        of the user if the user id matches the id in the JWT, otherwise returns a
        JSON representation of the user with only the id, name, lastname, mail.
        """
        user = db.session.query(UserModel).get_or_404(id)
        current_identity = get_jwt_identity()
        if current_identity == user.id:
            return user.to_json_complete()
        else:
            return user.to_json_short()
    
    @jwt_required()
    @role_required(roles=['admin', 'user'])
    def delete(self, id):
        """
        Handles DELETE requests to delete a user.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'user'.
        f the user id matches the id in the JWT or the role is 'admin', the request is completed.
        The user is deleted from the database and a JSON representation of the user is
        returned with a 204 status code. If an error occurs during processing, the transaction
        is rolled back and an error message is returned with a 400 status code.
        """
        user = db.session.query(UserModel).get_or_404(id)
        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role
        if current_identity != user.id and role != 'admin':
            return {'error':'Unauthorized'}, 401
        try:
            db.session.delete(user)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return user.to_json(), 201
    
    @jwt_required()
    def put(self, id):
        """
        Handles PUT requests to update a user.

        Requires a valid JWT token for authentication and the user id must match the id in the JWT.
        The request body must contain a JSON object with the fields to be modified. The fields that
        can be modified are: name, lastname, alias, mail, phone, role (only for admin).
        The user is updated in the database and a JSON representation of the user is returned with 
        a 201 status code. If an error occurs during processing, the transaction is rolled back and
        an error message is returned with a 400 status code.
        """
        user = db.session.query(UserModel).get_or_404(id)
        data = request.get_json()
        role = db.session.query(UserModel).get_or_404(get_jwt_identity()).role
        if user.id != get_jwt_identity() and (role != 'admin' and role != 'librarian'):
            return {'error':'Unauthorized'}, 401
        if user.id == get_jwt_identity():
            if data.get('name'):
                user.name = data.get('name')
            if data.get('lastname'):
                user.lastname = data.get('lastname')
            if data.get('mail'):
                user.mail = data.get('mail')
            if data.get('phone'):
                user.phone = data.get('phone')
            if data.get('alias'):
                user.alias = data.get('alias')
            if data.get('password'):
                user.plain_passwd = data.get('password')
        if data.get('role') and role == 'admin' or role == 'librarian':
            user.role = data.get('role')
        try:
            db.session.add(user)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return user.to_json() , 201 

class Users(Resource):
    @jwt_required()
    @role_required(roles=('admin', 'librarian'))
    def get(self):
        """
        Handles GET requests to obtain a list of users.

        Requires a valid JWT token for authentication and one of the roles: admin, librarian.

        The request body can contain the following parameters:
        - page: the page number to retrieve.
        - per_page: the number of items per page.
        In case no parameters are provided, the default values are used: page=1 and per_page=10.

        The response will contain a JSON object with the following structure:
        - users: an array of user objects, each with the structure returned by the to_json() method.
        - total: the total number of users.
        - pages: the total number of pages.
        - page: the current page number.

        The response will return filtered users based on the request parameters.

        If an error occurs during processing, the transaction is rolled back and an error message is returned with a 400 status code.
        """
        page = 1
        per_page = 10
        
        users = db.session.query(UserModel)
        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role
        if role == 'librarian':
            users=users.filter(UserModel.role.in_(['user', 'pending']))

        if request.args.get('id'):
            users=users.filter(UserModel.id == request.args.get('id'))
        if request.args.get('name'):
            users=users.filter(UserModel.name.like('%'+request.args.get('name')+'%'))
        if request.args.get('lastname'):
            users=users.filter(UserModel.lastname.like('%'+request.args.get('lastname')+'%'))
        if request.args.get('mail'):
            users=users.filter(UserModel.mail.like('%'+request.args.get('mail')+'%'))
        if request.args.get('phone'):
            users=users.filter(UserModel.phone.like('%'+request.args.get('phone')+'%'))
        if request.args.get('role'):
            users=users.filter(UserModel.role.like('%'+request.args.get('role')+'%'))
        if request.args.get('alias'):
            users=users.filter(UserModel.alias.like('%'+request.args.get('alias')+'%'))
        if request.args.get('rents'):
            users=users.filter(UserModel.rents.like('%'+request.args.get('rents')+'%'))
        
        if request.args.get('sortby_name'):
            if request.args.get('sortby_name') == "desc":
                users=users.order_by(desc(UserModel.name))
            else:
                users=users.order_by(asc(UserModel.name))
        if request.args.get('sortby_lastname'):
            if request.args.get('sortby_lastname') == "desc":
                users=users.order_by(desc(UserModel.lastname))
            else:
                users=users.order_by(asc(UserModel.lastname))

        users = users.paginate(page=page, per_page=per_page, error_out=True)

        return jsonify({
            'users': [user.to_json() for user in users],
            'total': users.total,
            'pages': users.pages,
            'page': page            
        })
    
    # This post method is to create a new user but without any restriction!!!
    # In production, this method should't be available.
    # # @role_required(roles=['admin']) # Uncomment this to activate restrictions
    # def post(self):
    #     user = UserModel.from_json(request.get_json())
    #     try:
    #         db.session.add(user)
    #         db.session.commit()
    #     except:
    #         db.session.rollback()
    #         return {'error':'Incorrect data format'}, 400
    #     return user.to_json(), 201