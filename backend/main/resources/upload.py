from flask import request, jsonify, current_app
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from main.auth.decorators import role_required
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class UploadImage(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def post(self):
        print(request.files)
        if 'file' not in request.files:
            return {"error": "No file part in the request"}, 400
        
        file = request.files['file']

        if file.filename == '':
            return {"error": "No file selected"}, 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(save_path)

            return {"message": "File uploaded successfully", "filename": filename}, 201
        else:
            return {"error": "File type not allowed"}, 400
