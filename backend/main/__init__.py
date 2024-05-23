from flask import Flask
from dotenv import load_dotenv
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import os

api = Api()
db = SQLAlchemy()
api = Api()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app=Flask(__name__)
    load_dotenv()

    if not os.path.exists(os.getenv("DATABASE_PATH")+os.getenv("DATABASE_NAME")):
        os.mknod(os.getenv("DATABASE_PATH")+os.getenv("DATABASE_NAME"))

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////'+os.getenv('DATABASE_PATH')+os.getenv('DATABASE_NAME')
    db.init_app(app)
    migrate.init_app(app,db)

    import main.resources as resources

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
    #Signin/Login
    api.add_resource(resources.SigninResources, '/signin')
    api.add_resource(resources.LoginResources, '/login')
    #Notifications
    api.add_resource(resources.NotificationResources, '/notifications')
    #Valorations
    api.add_resource(resources.ValorationsResources, '/valorations')
    api.add_resource(resources.ValorationResources, '/valoration/<id>')
    #Authors
    api.add_resource(resources.AuthorsResources, '/authors')
    api.add_resource(resources.AuthorResources, '/author/<id>')

    api.init_app(app)

    # Load secret key

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES'))
    jwt.init_app(app)

    from main.auth import routes
    app.register_blueprint(routes.auth)
    
    return app