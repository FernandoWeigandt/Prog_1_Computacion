from flask_restful import Resource
from flask import request, jsonify
from main.models import AuthorModel
from .. import db
from sqlalchemy import or_

class Author(Resource):
    def get(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        return author.to_json_complete()

    def put(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        data = request.get_json().items()
        try:
            for key, value in data:
                setattr(author, key, value)
            db.session.add(author)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return author.to_json() , 201

    def delete(self,id):
        author = db.session.query(AuthorModel).get_or_404(id)
        try:
            db.session.delete(author)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400

class Authors(Resource):
    def get(self):
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

        authors = authors.paginate(page=page, per_page=per_page, error_out=True)
        return jsonify({
            'authors': [author.to_json() for author in authors],
            'total': authors.total,
            'pages': authors.pages,
            'page': page
        })
    
    def post(self):
        try:
            author = AuthorModel.from_json(request.get_json())
            db.session.add(author)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return author.to_json(), 201