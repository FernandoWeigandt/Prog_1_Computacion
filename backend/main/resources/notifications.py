from datetime import datetime
from flask_restful import Resource
from flask import request, jsonify
from main.models import NotificationModel, UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from main.auth.decorators import role_required
from sqlalchemy import desc
from .. import db

class Notification(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def get(self, id):
        """
        Handles GET requests to retrieve a notification by id.

        Requires a valid JWT token for authentication and allows roles: admin, librarian, user.
        If the current user identity matches the provided id or the role is 'admin',
        the notification is returned as a JSON object. Otherwise, returns an error message
        with a 401 status code if unauthorized access is attempted.
        """
        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role
        if current_identity != id and role != 'admin':
            return {'error':'Unauthorized'}, 401
        notification = db.session.query(NotificationModel).get_or_404(id)
        return notification.to_json()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self, id):
        """
        Handles DELETE requests to remove a notification by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The requested notification is removed from the database. If the deletion is successful, a JSON 
        representation of the notification is returned with a 200 status code. If an error occurs during processing,
        the transaction is rolled back and an error message is returned with a 400 status code.
        """
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
        notification.date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        try:
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Incorrect data format'}, 400
        return {'message':'Notification updated successfully'}, 200

class Notifications(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian', 'user'])
    def get(self):
        """
        Handles GET requests to retrieve a list of notifications.

        Requires a valid JWT token for authentication and allows roles: admin, librarian, user.

        The request body can contain the following parameters:
        - page: the page number to retrieve. Default is 1.
        - per_page: the number of items per page. Default is 10.

        The response will contain a JSON object with the following structure:
        - notifications: an array of notification objects, each with the structure returned by the to_json() method.
        - total: the total number of notifications.
        - pages: the total number of pages.
        - page: the current page number.

        The response will return filtered notifications based on the request parameters.

        If an error occurs during processing, the transaction is rolled back and an error message is returned with a 400 status code.
        """
        page = 1
        per_page = 10
        notifications = db.session.query(NotificationModel)
        notifications = notifications.order_by(desc(NotificationModel.id))

        current_identity = get_jwt_identity()
        role = db.session.query(UserModel).get_or_404(current_identity).role

        if role == 'user':
            notifications = notifications.filter(NotificationModel.user_id == current_identity)

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

    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def post(self):
        """
        Handles POST requests to create a new notification.

        Requires a valid JWT token for authentication. Expects the request body to
        contain JSON data representing a notification. Attempts to create and persist a
        new NotificationModel instance from the provided JSON data. If successful, the
        notification is added to the database and a JSON representation of the notification
        is returned with a 201 status code. If an error occurs during processing,
        the transaction is rolled back and an error message is returned with a
        400 status code.
        """
        data = request.get_json()
        db.session.query(UserModel).get_or_404(data.get('user_id'))
        notification = NotificationModel.from_json(data)
        try:
            db.session.add(notification)
            db.session.commit()
        except:
            db.session.rollback()
        return {'message':'Notification created successfully','notification': notification.to_json_short()}, 201