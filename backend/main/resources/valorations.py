from flask_restful import Resource
from flask import request, jsonify
from main.models import ValorationModel
from .. import db

class Valoration(Resource):
    def get(self):   
        valorations = db.session.query(ValorationModel).all()
        return jsonify([valoration.to_json() for valoration in valorations])
    
    def post(self):
        valoration = ValorationModel.from_json(request.get_json())
        db.session.add(valoration)
        db.session.commit()
        return valoration.to_json(), 201