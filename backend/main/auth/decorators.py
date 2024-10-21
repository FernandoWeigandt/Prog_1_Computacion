from .. import jwt
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from functools import wraps

#Decorador para restringir el acceso a usuarios/useres por role
def role_required(roles):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            #Verificar que el JWT es correcto
            verify_jwt_in_request()
            #Obtener claims de adentro del JWT
            claims = get_jwt()
            #Verificar que el role sea uno de los permitidos por la ruta
            if claims['role'] in roles :
                #Ejecutar función
                return fn(*args, **kwargs)
            else:
                return 'Role sin permisos de acceso al recurso', 403
        return wrapper
    return decorator

#Define el atributo que se utilizará para identificar el usuario
@jwt.user_identity_loader
def user_identity_lookup(user):
    #Definir ID como atributo identificatorio
    return user.id

#Define que atributos se guardarán dentro del token
@jwt.additional_claims_loader
def add_claims_to_access_token(user):
    claims = {
        'role': user.role,
        'id': user.id,
        'mail': user.mail
    }
    return claims