from flask_restful import Resource
from flask import request, jsonify
from main.models import CommentModel
from .. import db

class Comment(Resource):
    def get(self, id):
        comment = db.session.query(CommentModel).get_or_404(id)
        return comment.to_json()
    
    def delete(self, id):
        comment = db.session.query(CommentModel).get_or_404(id)
        try:
            db.session.delete(comment)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return comment.to_json()
    
    def put(self, id):
        comment = db.session.query(CommentModel).get_or_404(id)
        data = request.get_json().items()
        try:
            for key, value in data:
                setattr(comment, key, value)
            db.session.add(comment)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return comment.to_json(), 200

class Comments(Resource): 
    def get(self):
        comments = [comment.to_json() for comment in CommentModel.query.all()]
        return jsonify({'comments': comments})

    def post(self):
        comment_json = request.get_json()
        try:
            comment = CommentModel.from_json(comment_json)
            db.session.add(comment)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return comment.to_json(), 201