from .user import USERS 
from flask_restful import Resource
from flask import request

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = data['name']
        for user_id, user_info in USERS.items():
            if user_info['name'] == user:
                return {'user_id':user_id}, 200
        return "Id not found", 404