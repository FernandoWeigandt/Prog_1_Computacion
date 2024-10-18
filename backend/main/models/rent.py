from .. import db
from . import UserModel
from datetime import datetime

class Rent(db.Model):
    __tablename__ = 'rents'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    # Relation 1:N (1 user : N rent), User is Parent
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='rent', uselist=False, single_parent=True)
    # Relation 1:1 (1 book_copy : 1 rents), Medium table books_rents
    book_copy_id = db.Column(db.Integer, db.ForeignKey('book_copies.id'), nullable=False)
    book_copy = db.relationship('BookCopies', back_populates='rent', uselist=False, single_parent=True)
    # Dates
    init_date = db.Column(db.DateTime, nullable=False)
    expiration_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return '<Rent %r>' % self.id

    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration_date': str(self.expiration_date.strftime('%Y-%m-%d'))
        }
        return rent_json

    def to_json_complete(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration_date': str(self.expiration_date.strftime('%Y-%m-%d')),
            'user': self.user.to_json_short(),
            'book': self.book_copy.to_json_short()
        }
        return rent_json

    def to_json_short(self):
        rent_json = {'id': self.id}
        return rent_json

    @staticmethod
    def from_json_attr(rent_json):
        if rent_json.get('init_date') != None:
            rent_json['init_date'] = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d')
        if rent_json.get('expiration_date') != None:
            rent_json['expiration_date'] = datetime.strptime(rent_json.get('expiration_date'), '%Y-%m-%d')
        return rent_json

    @staticmethod
    def from_json(rent_json):
        id = rent_json.get('id')
        init_date = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d')
        expiration_date = datetime.strptime(rent_json.get('expiration_date'), '%Y-%m-%d')
        user_id = rent_json.get('user_id')
        book_copy_id = rent_json.get('book_copy_id')

        return Rent(
            id = id,
            init_date = init_date,
            expiration_date = expiration_date,
            user_id = user_id,
            book_copy_id = book_copy_id
        )