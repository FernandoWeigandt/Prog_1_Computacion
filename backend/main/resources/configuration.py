from flask_restful import Resource
from flask import request

# Test JSON Data

CONFIG = {
    'general':{'disposition':'disposition1', 'order':'ascendent'}
}

class Configuration(Resource):
    def get(self):
        return CONFIG['general']
    
    def put(self):
        configuration = CONFIG['general']
        new_config = request.get_json()
        configuration.update(new_config)
        return '', 201