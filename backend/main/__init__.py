from flask import flask
from dotenv import load_dotenv

# Este metodo create_app inicializa la app y todos los modulos
def create_app():
    app=Flask(__name__)
    load_dotenv()
    return app