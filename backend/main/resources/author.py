from flask_restful import Resource
from flask import request, jsonify
from main.models import AuthorModel
from .. import db

class Authors(Resource):
    def get(self):
        Authors = db.session.query(AuthorModel).all()
        return jsonify([author.to_json() for author in Authors])
    
    def post(self):
        author = AuthorModel.from_json(request.get_json())
        db.session.add(author)
        db.session.commit()
        return author.to_json(), 201

class Author(Resource):
    def get(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        return author.to_json()

    def put(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(author, key, value)
        db.session.add(author)
        db.session.commit()
        return author.to_json() , 201

    def delete(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        db.session.delete(author)
        db.session.commit()
        return author.to_json(), 204