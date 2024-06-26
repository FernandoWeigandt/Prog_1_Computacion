from .. import db
from . import UserModel
from datetime import datetime

class Rent(db.Model):
    __tablename__ = 'rents'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    init_date = db.Column(db.DateTime, nullable=False)
    expiration = db.Column(db.DateTime, nullable=False)
    # Relation 1:1 (1 user : 1 rent), User is Parent
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='rent', uselist=False, single_parent=True)
    # Relation N:M (N books : M rents), Medium table books_rents
    # No need to define the relation as it was backref in book

    def __repr__(self):
        return '<Rent> id:%r' % (self.id)

    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration': str(self.expiration.strftime('%Y-%m-%d'))
        }
        return rent_json

    def to_json_complete(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        books = [book.to_json() for book in self.books]
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration': str(self.expiration.strftime('%Y-%m-%d')),
            'user': self.user.to_json(),
            'books': books
        }
        return rent_json

    def to_json_short(self):
        rent_json = {'id': self.id}
        return rent_json

    @staticmethod
    def from_json_attr(rent_json):
        if rent_json.get('init_date') != None:
            rent_json['init_date'] = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d')
        if rent_json.get('expiration') != None:
            rent_json['expiration'] = datetime.strptime(rent_json.get('expiration'), '%Y-%m-%d')
        return rent_json

    @staticmethod
    def from_json(rent_json):
        id = rent_json.get('id')
        init_date = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d')
        expiration = datetime.strptime(rent_json.get('expiration'), '%Y-%m-%d')
        user_id = rent_json.get('user_id')

        return Rent(
            id = id,
            init_date = init_date,
            expiration = expiration,
            user_id = user_id
        )