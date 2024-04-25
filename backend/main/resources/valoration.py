from flask_restful import Resource
from flask import request, jsonify
from main.models import ValorationModel
from .. import db

class Valoration(Resource):
    def get(self,id):   
        valoration = db.session.query(ValorationModel).get_or_404(id)
        return valoration.to_json()
    
    def put(self, id):
        valoration = db.session.query(ValorationModel).get_or_404(id)
        data = request.get_json().items()
        for key, value in data:
            setattr(valoration, key, value)
        db.session.add(valoration)
        db.session.commit()
        return valoration.to_json() , 201 
        
    def delete(self, id):
        valoration = db.session.query(ValorationModel).get_or_404(id)
        db.session.delete(valoration)
        db.session.commit()
        return valoration.to_json(), 204

class Valorations(Resource):
    def get(self):
        valorations = db.session.query(ValorationModel).all()
        return jsonify([valoration.to_json() for valoration in valorations])
    
    def post(self):
        valoration = ValorationModel.from_json(request.get_json())
        db.session.add(valoration)
        db.session.commit()
        return valoration.to_json(), 201