from flask_restful import Resource
from flask import request, jsonify
from main.models import AuthorModel
from .. import db
from sqlalchemy import or_, and_
from main.auth.decorators import role_required
from flask_jwt_extended import jwt_required

class Author(Resource):
    def get(self,id):
        """
        Handles GET requests to retrieve an author by id.

        Retrieves an author from the database matching the provided id. If found,
        the author is converted to JSON format and returned in a JSON response.
        If not found, a 404 status code is returned.
        """
        author = db.session.query(AuthorModel).get_or_404(id)
        return author.to_json_complete()

    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def put(self,id):
        """
        Handles PUT requests to update an author by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The request body must contain a JSON object with the fields to be modified. The fields that
        can be modified are those present in the AuthorModel.

        Args:
            id (int): The id of the author to be updated.

        Returns:
            JSON response with the updated author data and a 201 status code if successful.
            If an error occurs during processing, returns an error message with a 400 status code.
        """
        author = db.session.query(AuthorModel).get_or_404(id)
        data = request.get_json()
        if data.get('name'):
            author.name = data.get('name')
        if data.get('lastname'):
            author.lastname = data.get('lastname')
        try:
            db.session.add(author)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return {'message': 'updated successfully', 'author': author.to_json()} , 201

    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self,id):
        """
        Handles DELETE requests to remove an author by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The requested author is removed from the database. If the deletion is successful, a 204 status code is returned.
        If an error occurs during processing, an error message is returned with a 400 status code.
        """
        author = db.session.query(AuthorModel).get_or_404(id)
        try:
            db.session.delete(author)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return {'message': 'deleted successfully', 'author': author.to_json()}, 201

class Authors(Resource):
    def get(self):
        """
        Handles GET requests to obtain a list of authors.

        Request Parameters (via query string):
        - page: the page number to retrieve. Default is 1.
        - per_page: the number of items per page. Default is 5.
        - name: filter authors by name.
        - lastname: filter authors by lastname.
        - name_or_lastname: filter authors by name or lastname.
        - fullname: filter authors by name and lastname.

        The response will contain a JSON object with:
        - authors: an array of author objects, each with the structure returned by the to_json() method.
        - total: the total number of authors.
        - pages: the total number of pages.
        - page: the current page number.
        """
        page = 1
        per_page = 5

        authors = db.session.query(AuthorModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))

        # filters
        name_filter = request.args.get('name')
        if name_filter:
            authors=authors.filter(AuthorModel.name.like('%'+name_filter+'%'))
        
        lastname_filter = request.args.get('lastname')
        if lastname_filter:
            authors=authors.filter(AuthorModel.lastname.like('%'+lastname_filter+'%'))

        name_or_lastname = request.args.get('name_or_lastname')
        if name_or_lastname:
            authors = authors.filter(
                or_(
                    AuthorModel.name.like(f'%{name_or_lastname}%'),
                    AuthorModel.lastname.like(f'%{name_or_lastname}%')
                )
            )
            
        fullname = request.args.get('fullname')
        if fullname:
            name=fullname.split(' ')[0]
            lastname=fullname.split(' ')[1]
            authors=authors.filter(
                and_(
                  AuthorModel.name == name,
                  AuthorModel.lastname == lastname
                )
            )

        authors = authors.paginate(page=page, per_page=per_page, error_out=True)
        return jsonify({
            'authors': [author.to_json() for author in authors],
            'total': authors.total,
            'pages': authors.pages,
            'page': page
        })
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def post(self):
        """
        Handles POST requests to create a new author.

        Requires a valid JWT token for authentication and one of the roles: admin, librarian.

        Request Body:
        - name: the name of the author.
        - lastname: the lastname of the author.

        Returns a JSON object with the new author data and a 201 status code.
        If there is an error, it returns a JSON object with an error message and a 400 status code.
        """
        author = AuthorModel.from_json(request.get_json())
        try:
            db.session.add(author)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return {'message': 'created successfully', 'author': author.to_json()}, 201