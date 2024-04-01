from flask_restful import Resource
from flask import request

# Test JSON Data

USERS = {
    1:{'name':'user1', 'rol':'user'},
    2:{'name':'user2', 'rol':'user'},
    3:{'name':'user3', 'rol':'user'},
    4:{'name':'admin', 'rol':'admin'},
}

class User(Resource):
    def get(self, id):
        if int(id) in USERS:
            return USERS[int(id)]
        return 'Id not found', 404
    
    def delete(self, id):
        if int(id) in USERS:
            del USERS[int(id)]
            return '', 204
        return 'Id not found', 404
    
    def put(self, id):
        if int(id) in USERS:
            user = USERS[int(id)]
            data = request.get_json()
            user.update(data)
            return '', 201
        return 'Id not found', 404
    
class Users(Resource):
    def get(self):
        return USERS
    
    def post(self):
        user = request.get_json()
        id = int(max(USERS.keys())) + 1
        USERS[id] = user
        return USERS[id], 201