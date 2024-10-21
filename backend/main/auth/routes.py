from flask import request, jsonify, Blueprint
from .. import db
from main.models import UserModel
from flask_jwt_extended import create_access_token
from main.mail.functions import sendMail

#Blueprint para acceder a los métodos de autenticación
auth = Blueprint('auth', __name__, url_prefix='/auth')

#Método de logueo
@auth.route('/login', methods=['POST'])
def login():
    #Busca al user en la db por mail
    user = db.session.query(UserModel).filter(UserModel.mail == request.get_json().get("mail")).first_or_404()
    #Valida la contraseña
    if user.validate_passwd(request.get_json().get("passwd")):
        #Genera un nuevo token
        #Pasa el objeto user como identidad
        access_token = create_access_token(identity=user)
        #Devolver valores y token
        data = {
            'id': str(user.id),
            'mail': user.mail,
            'access_token': access_token
        }

        return data, 200
    else:
        return {'message':'Incorrect password'}, 401

#Método de registro
@auth.route('/register', methods=['POST'])
def register():
    #Obtener user
    user = UserModel.from_json(request.get_json())
    #Verificar si el mail ya existe en la db, scalar() para saber la cantidad de ese mail
    exists = db.session.query(UserModel).filter(UserModel.mail == user.mail).scalar() is not None
    if exists:
        return {'message':'Mail aready used'}, 409
    else:
        try:
            #Agregar user a DB
            db.session.add(user)
            db.session.commit()
            send = sendMail([user.mail],"Welcome!",'register',user = user)
        except Exception as error:
            db.session.rollback()
            return str(error), 409
        return user.to_json(), 201