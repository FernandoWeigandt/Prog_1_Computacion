from flask_restful import Resource
from flask import request, jsonify
from main.models import CommentModel
from .. import db

class Comments(Resource): 
    def get(self):
        comments = [comment.to_json() for comment in CommentModel.query.all()]
        return jsonify({'comments': comments})

    def post(self):
        comment_json = request.get_json()
        comment = CommentModel.from_json(comment_json)
        db.session.add(comment)
        db.session.commit()
        return comment.to_json()
    
class Comment(Resource):
    def get(self, id):
        comment = db.session.query(CommentModel).get_or_404(id)
        return comment.to_json()
    
    def delete(self, id):
        comment = db.session.query(CommentModel).get_or_404(id)
        db.session.delete(comment)
        db.session.commit()
        return comment.to_json()