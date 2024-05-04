from .. import db
from . import UserModel
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    date = db.Column(db.DateTime, nullable=False)
    msg = db.Column(db.String(250), nullable=False)
    # Relation 1:N (1 user : N notifications), User is parent
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='notifications', uselist=False, single_parent=True)
    
    def __repr__(self):
        return '<Notification> id:%r, msg:%r' % (self.id, self.msg)

    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        notification_json = {
            'id': self.id,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'msg': str(self.msg),
            'user': self.user.to_json()
        }
        return notification_json

    def to_json_short(self):
        notification_json = {'id': self.id}
        return notification_json

    @staticmethod
    def from_json(notification_json):
        id = notification_json.get('id')
        date = datetime.strptime(notification_json.get('date'), '%Y-%m-%d')
        msg = notification_json.get('msg')
        user_id = notification_json.get('user_id')

        return Notification(
            id=id,
            date = date,
            msg = msg,
            user_id = user_id
        )