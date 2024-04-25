from flask_restful import Resource
from flask import request, jsonify
from main.models import NotificationModel
from .. import db

class Notification(Resource):
    def post(self):
        notification = NotificationModel.from_json(request.get_json())
        db.session.add(notification)
        db.session.commit()
        return notification.to_json(), 201