from .. import db
from . import UserModel, BookModel
from datetime import datetime

class Valoration(db.Model):
    __tablename__ = 'valorations'
    id = db.Column(db.Integer, primary_key = True, unique=True, autoincrement=True)
    comment = db.Column(db.String(250), nullable = True)
    valoration = db.Column(db.Integer, nullable = False)
    date = db.Column(db.DateTime, nullable = False)
    # Relation 1:1 (1 user : 1 valoration)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='valoration', single_parent=True)
    # Relation 1:N (1 book : N valorations)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
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

    def to_json_no_book(self):
        valoration_json = {
            'id': self.id,
            'comment': str(self.comment),
            'valoration': self.valoration,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'user': self.user.to_json_short()
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
            date = date,
            user_id = user_id,
            book_id = book_id
        )