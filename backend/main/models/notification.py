from .. import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    msg = db.Column(db.String(250), nullable=False)
    
    def __repr__(self):
        return '<Notification> id:%r, msg:%r' % (self.id, self.msg)

    def to_json(self):
        notification_json = {
            'id': self.id,
            'date': str(self.date.strftime("%d-%m-%Y")),
            'msg': str(self.msg)
        }
        return notification_json

    def to_json_short(self):
        notification_json = {
            'id': self.id
        }
        return notification_json

    @staticmethod
    def from_json(notification_json):
        id = notification_json.get('id')
        date = datetime.strptime(notification_json.get('date'), "%d-%m-%Y")
        msg = notification_json.get('msg')

        return Notification(id=id,
                    date = date,
                    msg = msg
                    )