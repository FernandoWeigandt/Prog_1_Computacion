from flask_restful import Resource
from flask import request

# Test JSON Data

ACCOUNTS = {
    1:{'account':'user1', 'password':'qwer'},
    2:{'account':'user2', 'password':'qwert'},
    3:{'account':'user3', 'password':'qwerty'},
    4:{'account':'user4', 'password':'qwertyu'},
}

class Signin(Resource):
    def post(self):
        login = request.get_json()
        id = int(max(ACCOUNTS.keys())) + 1
        ACCOUNTS[id] = login
        return ACCOUNTS[id], 201