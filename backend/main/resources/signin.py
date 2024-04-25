from .user import USERS
from flask_restful import Resource
from flask import request

class Signin(Resource):
    def post(self):
        signin = request.get_json()
        id = int(max(USERS.keys())) + 1
        USERS[id] = signin
        return USERS[id], 201