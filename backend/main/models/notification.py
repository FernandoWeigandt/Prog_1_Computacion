from .. import db
from . import UserModel
from datetime import datetime

########################################################
#           Notification Table definition              #
########################################################

# The notificaton table has the following structure
#
#                         NOTIFICATION
#    _____________________________________________________________
#   | id | user_id | title | body | date | note | category | read |
#   | PK |   FK    |  STR  | TEXT |  DAT | STR  |   STR    | BOOL |
#   |____|_________|_______|______|______|______|__________|______|
#

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.String(250), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    note = db.Column(db.String(100))
    read = db.Column(db.Boolean, default=False, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    # Relation 1:N (1 user : N notifications), User is parent
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='notifications', uselist=False, single_parent=True)

    ########################################################
    #             Methods to convert to JSON               #
    ########################################################
    
    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        notification_json = {
            'id': self.id,
            'title': self.title,
            'body': str(self.body),
            'date': str(self.date.strftime('%Y-%m-%d')),
            'note': self.note,
            'read': self.read,
            'category': self.category,
            'user': self.user.to_json_short()
        }
        return notification_json

    def to_json_short(self):
        notification_json = {'id': self.id}
        return notification_json

    @staticmethod
    def from_json(notification_json):
        title = notification_json.get('title')
        body = notification_json.get('body')
        date = datetime.strptime(notification_json.get('date'), '%Y-%m-%d')
        note = notification_json.get('note')
        read = notification_json.get('read')
        category = notification_json.get('category')
        user_id = notification_json.get('user_id')

        return Notification(
            title = title,
            body = body,
            date = date,
            note = note,
            read = read,
            category = category,
            user_id = user_id
        )