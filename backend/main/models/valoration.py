from .. import db
from . import UserModel, BookModel
from datetime import datetime

class Valoration(db.Model):
    __tablename__ = 'valorations'
    id = db.Column(db.Integer, primary_key = True)
    comment = db.Column(db.String(250), nullable = True)
    valoration = db.Column(db.Integer, nullable = False)
    date = db.Column(db.DateTime, nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    user = db.relationship('User', back_populates='valorations', uselist=False, single_parent=True)
    book = db.relationship('Book', back_populates='valorations', uselist=False, single_parent=True)
    
    def __repr__(self):
        return '<Valoration> id:%r, valoration:%r, comment:%r' % (self.id, self.valoration, self.comment)

    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        self.book = db.session.query(BookModel).get_or_404(self.book_id)
        valoration_json = {
            'id': self.id,
            'comment': str(self.comment),
            'valoration': self.valoration,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'user': self.user.to_json(),
            'book':self.book.to_json()
        }
        return valoration_json

    def to_json_short(self):
        valoration_json = {'id': self.id}
        return valoration_json

    @staticmethod
    def from_json(valoration_json):
        id = valoration_json.get('id')
        valoration = valoration_json.get('valoration')
        comment = valoration_json.get('comment')
        date = datetime.strptime(valoration_json.get('date'), '%Y-%m-%d')
        user_id = valoration_json.get('user_id')
        book_id = valoration_json.get('book_id')

        return Valoration(
            id = id,
            valoration = valoration,
            comment = comment,
            date = date
        )