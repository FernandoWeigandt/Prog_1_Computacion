from datetime import datetime
from flask_restful import Resource
from flask import request, jsonify
from main.models import NotificationModel, UserModel
from .. import db

class Notification(Resource):
    def get(self, id):
        notification = db.session.query(NotificationModel).get_or_404(id)
        return notification.to_json()
    
    def delete(self, id):
        notification = db.session.query(NotificationModel).get_or_404(id)
        try:
            db.session.delete(notification)
            db.session.commit()
        except:
            return {'error':'Incorrect data format'}, 400
        return notification.to_json()
    
    def put(self, id):
        notification = db.session.query(NotificationModel).get_or_404(id)
        data = request.get_json()
        print(notification, data)
        notification.title = data.get('title')
        notification.body = data.get('body')
        notification.note = data.get('note')
        notification.read = data.get('read', False)
        notification.category = data.get('category')
        notification.user_id = data.get('user_id')
        notification.date = datetime.strptime(data.get('date'), '%Y-%m-%dT%H:%M:%S')
        try:
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'error':f'{e}'}, 400
        return notification.to_json()

class Notifications(Resource):
    def get(self):
        page = 1
        per_page = 10
        notifications = db.session.query(NotificationModel)
        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))
        notifications = notifications.paginate(page=page, per_page=per_page, error_out=True)
        return jsonify({
            'notifications': [notification.to_json() for notification in notifications],
            'total': notifications.total,
            'pages': notifications.pages,
            'page': page
        })

    def post(self):
        data = request.get_json()
        user = db.session.query(UserModel).get(data.get('user_id'))
        if not user:
            return {'error':'User not found'}, 404
        try:
            notification = NotificationModel.from_json(data)
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'error':f'{e}'}, 400
        return notification.to_json(), 201