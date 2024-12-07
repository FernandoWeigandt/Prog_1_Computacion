from flask_restful import Resource
from main.models import RentModel, BookCopyModel, UserModel, BookModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from flask import request, jsonify
from sqlalchemy import desc
from .. import db

class Rent(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def get(self, id):
        """
        Handles GET requests to obtain a rent by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        Returns a JSON representation of the rent with all its attributes.
        """
        rents = db.session.query(RentModel).get_or_404(id)
        return rents.to_json_complete()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self, id):
        """
        Handles DELETE requests to remove a rent.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The requested rent is removed from the database and a JSON representation of the rent is
        returned with a 200 status code. If an error occurs during processing,
        the transaction is rolled back and an error message is returned with a
        400 status code.
        """
        rent = db.session.query(RentModel).get_or_404(id)
        try:
            db.session.delete(rent)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return {'message':'Rent deleted', 'rent': rent.to_json()}, 200
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def put(self, id):
        """
        Handles PUT requests to modify a rent.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The request body must contain a JSON object with the fields to be
        modified. The fields that can be modified are: init_date, expiration_date.

        Args:
            id (int): The id of the rent to be modified.

        Returns:
            JSON response with the rent modified in JSON format.
        """
        rent = db.session.query(RentModel).get_or_404(id)
        data = RentModel.from_json_attr(request.get_json())
        if data.get('init_date'):
            rent.init_date = data.get('init_date')
        if data.get('expiration_date'):
            rent.expiration_date = data.get('expiration_date')
        try:
            db.session.add(rent)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json() , 200
    
class Rents(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def get(self):
        """
        Handles GET requests to obtain a list of rents with optional filtering.

        Requires a valid JWT token for authentication and allows roles: admin, librarian, user.

        Request Parameters (via query string):
        - page: the page number to retrieve. Default is 1.
        - per_page: the number of items per page. Default is 10.
        - old: boolean to sort rents by older entries.
        - user_id: filter rents by a specific user ID (admin/librarian only).
        - user_name: filter rents by a user name pattern (admin/librarian only).
        - book_copy_id: filter rents by a specific book copy ID (admin/librarian only).
        - book_title: filter rents by a book title pattern (admin/librarian only).
        - init_date: filter rents by the initial date.
        - expiration_date: filter rents by the expiration date.

        For users, the response will return only their own rents. Admins and librarians
        can filter by additional criteria.

        The response contains a JSON object with:
        - rents: an array of rent objects.
        - total: the total number of rents.
        - pages: the total number of pages.
        - page: the current page number.
        """
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
    @role_required(roles=['librarian', 'admin'])
    def post(self):
        """
        Handles POST requests to create a new rent.

        Requires a valid JWT token for authentication and one of the roles: librarian, admin.

        The request body must contain the following JSON structure:
        - user_id: the id of the user renting the book copy.
        - book_copy_id: the id of the book copy being rented.

        If the request body does not contain the required structure, a 400 status code is returned with an error message.

        The response will contain a JSON representation of the newly created rent with a 201 status code.
        """
        data = request.get_json()
        db.session.query(UserModel).get_or_404(data.get('user_id'))
        db.session.query(BookCopyModel).get_or_404(data.get('book_copy_id'))
        rent = RentModel.from_json(data)
        try:
            db.session.add(rent)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return rent.to_json(), 201