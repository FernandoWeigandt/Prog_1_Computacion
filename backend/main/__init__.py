from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api

import main.resources as resources 

api = Api()

def create_app():
    app=Flask(__name__)
    load_dotenv()
    #User
    api.add_resource(resources.UsersResources, '/users')
    api.add_resource(resources.UserResources, '/user/<id>')
    #Book
    api.add_resource(resources.BooksResources, '/books')
    api.add_resource(resources.BookResources, '/book/<id>')
    #Rent
    api.add_resource(resources.RentsResources, '/rents')
    api.add_resource(resources.RentResources, '/rent/<id>')
    #Config
    api.add_resource(resources.ConfigResources, '/config')
    
    api.init_app(app)
    return app