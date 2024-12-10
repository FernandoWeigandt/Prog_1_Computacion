from .. import db
from . import UserModel
from . import BookCopyModel
from datetime import datetime

########################################################
#                 Rent Table definition                #
########################################################

# The rent table has the following structure
#
#                             RENT
#    ___________________________________________________________
#   | id | user_id | book_copy_id | init_date | expiration_date |
#   | PK |   FK    |     FK       |    DAT    |       DAT       |
#   |____|_________|______________|___________|_________________|
#
#
#    This model goal, appart from storing information about the rent,
#    is to make sure that a book copy is not rented by multiple users
#    or by 1 user multiple times.
#    The combination between the user and the book copy is unique.
#    So, if a user tries to rent a book copy twice, it will fail.
#    Note: a book_copy is not a book model, it's a physical copy of a book
#          so if a user wants two book copies of a same book, can rent
#          two copies (that will have different ids).

class Rent(db.Model):
    __tablename__ = 'rents'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    # Relation 1:N (1 user : N rent)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='rents', uselist=False, single_parent=True, lazy='joined')
    # Relation 1:1 (1 book_copy : 1 rents)
    book_copy_id = db.Column(db.Integer, db.ForeignKey('book_copy.id'), unique=True, nullable=False)
    book_copy = db.relationship('BookCopy', back_populates='rent', uselist=False, single_parent=True, lazy='joined')
    # Dates
    init_date = db.Column(db.Date, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)

    # Unique book_copy_id and user_id
    __table_args__ = (
        db.UniqueConstraint('user_id', 'book_copy_id', name='unique_user_book_copy'),
    )

    ########################################################
    #         Methods to define dinamic properties         #
    ########################################################

    @property
    def status(self):
        today = datetime.now().date()
        if self.expiration_date == today:
            return 'pending'
        elif self.expiration_date > today:
            print(self.expiration_date, today)
            print(self.expiration_date > today)
            return 'active'
        else:
            return 'expired'

    ########################################################
    #             Methods to convert to JSON               #
    ########################################################

    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration_date': str(self.expiration_date.strftime('%Y-%m-%d')),
            'status': str(self.status)
        }
        return rent_json
    
    def to_json_user(self):
        self.book_copy = db.session.query(BookCopyModel).get_or_404(self.book_copy_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration_date': str(self.expiration_date.strftime('%Y-%m-%d')),
            'copy': self.book_copy.to_json_short(),
            'status': str(self.status)
        }
        return rent_json

    def to_json_complete(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        rent_json = {
            'id': self.id,
            'init_date': str(self.init_date.strftime('%Y-%m-%d')),
            'expiration_date': str(self.expiration_date.strftime('%Y-%m-%d')),
            'user': self.user.to_json_short(),
            'copy': self.book_copy.to_json_short(),
            'status': str(self.status)
        }
        return rent_json

    def to_json_short(self):
        rent_json = {'id': self.id}
        return rent_json

    ########################################################
    #             Methods to convert from JSON             #
    ########################################################


    @staticmethod
    def from_json_attr(rent_json):
        if rent_json.get('init_date') != None:
            rent_json['init_date'] = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d')
        if rent_json.get('expiration_date') != None:
            rent_json['expiration_date'] = datetime.strptime(rent_json.get('expiration_date'), '%Y-%m-%d')
        return rent_json

    @staticmethod
    def from_json(rent_json):
        init_date = datetime.strptime(rent_json.get('init_date'), '%Y-%m-%d').date() if rent_json.get('init_date') else datetime.now().date()
        expiration_date = datetime.strptime(rent_json.get('expiration_date'), '%Y-%m-%d').date() if rent_json.get('expiration_date') else datetime.now().date()
        user_id = rent_json.get('user_id') 
        book_copy_id = rent_json.get('book_copy_id')

        if init_date > expiration_date:
            raise ValueError('init_date must be before expiration_date')

        return Rent(
            init_date = init_date,
            expiration_date = expiration_date,
            user_id = user_id,
            book_copy_id = book_copy_id
        )
    
    ########################################################
    #                   repr of the rent                   #
    ########################################################

    def __repr__(self):
        rent = 'Rent:\n'
        rent += f'    id: {self.id}\n'
        rent += f'    user_id: {self.user_id}\n'
        rent += f'    book_copy_id: {self.book_copy_id}\n'
        rent += f'    init_date: {self.init_date}\n'
        rent += f'    expiration_date: {self.expiration_date}\n'
        return rent