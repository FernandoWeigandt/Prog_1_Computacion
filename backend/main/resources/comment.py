from flask_restful import Resource
from flask import request, jsonify
from main.models import CommentModel, UserModel, BookModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from datetime import datetime
from .. import db

class Comment(Resource):
    def get(self, id):
        """
        Retrieves a comment from the database.

        Queries the database for a CommentModel instance matching the provided
        id. If found, the comment is converted to JSON format and returned in a
        JSON response. If not found, a 404 status code is returned.
        """
        comment = db.session.query(CommentModel).get_or_404(id)
        return comment.to_json()
    
    @jwt_required()
    @role_required(roles=['admin', 'user'])
    def delete(self, id):
        """
        Handles DELETE requests to remove a comment.

        Requires a valid JWT token for authentication. The requested comment is
        removed from the database and a JSON representation of the comment is
        returned with a 200 status code. If an error occurs during processing,
        the transaction is rolled back and an error message is returned with a
        400 status code.
        """
        comment = db.session.query(CommentModel).get_or_404(id)
        user = db.session.query(UserModel).get_or_404(comment.user_id)
        current_identity = get_jwt_identity()
        if current_identity != user.id and user.role != 'admin':
            return {'error':'Unauthorized'}, 401
        book = db.session.query(BookModel).get_or_404(comment.book_id)
        if book.id != comment.book_id:
            return {'error':'Bad request'}, 400
        try:
            db.session.delete(comment)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return comment.to_json()
    
    @jwt_required()
    @role_required(roles=['user'])
    def put(self, id):
        """
        Modifies a comment in the database.

        Updates a comment in the database using data from the request body.
        The request body must contain a JSON object with the fields to be
        modified. The fields that can be modified are: body, rate, date.
        The user must be the one that created the comment.

        Args:
            id (int): The id of the comment to be modified.

        Returns:
            JSON response with the comment modified in JSON format.
        """
        comment = db.session.query(CommentModel).get_or_404(id)
        user = db.session.query(UserModel).get_or_404(comment.user_id)
        current_identity = get_jwt_identity()
        if current_identity != user.id:
            return {'error':'Unauthorized'}, 401
        book = db.session.query(BookModel).get_or_404(comment.book_id)
        if book.id != comment.book_id:
            return {'error':'Bad request'}, 400
        data = request.get_json()
        if data.get('body'):
            comment.body = data.get('body')
        if data.get('rate'):
            comment.rate = data.get('rate')
        if data.get('date'):
            comment.date = datetime.strptime(data.get('date'), "%Y-%m-%d")
        try:
            db.session.add(comment)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'error':'Incorrect data format', 'exception': str(e), 'comment': comment.to_json()}, 400
        return comment.to_json_short(), 200

class Comments(Resource): 
    @jwt_required()
    @role_required(roles=['user'])
    def post(self):
        """
        Handles POST requests to create a new comment.

        Requires a valid JWT token for authentication. Expects the request body to
        contain JSON data representing a comment. Attempts to create and persist a
        new CommentModel instance from the provided JSON data. If successful, the
        comment is added to the database and a JSON representation of the comment
        is returned with a 201 status code. If an error occurs during processing,
        the transaction is rolled back and an error message is returned with a
        400 status code.
        """
        comment_json = request.get_json()
        db.session.query(UserModel).get_or_404(comment_json.get('user_id'))
        db.session.query(BookModel).get_or_404(comment_json.get('book_id'))
        comment = CommentModel.from_json(comment_json)
        try:
            db.session.add(comment)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return {'message': 'created successfully'}, 201