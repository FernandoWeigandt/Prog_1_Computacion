from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

########################################################
#                User Table definition                 #
########################################################

# The user table has the following structure
#
#                                             USER
#   ______________________________________________________________________________________________
#  | id | name | lastname | mail | phone | role | alias | passwd | comments | rent | notifications |
#  | PK |  STR |   STR    | STR  |  STR  | STR |  STR  |  STR   |    FK    |  FK  |     FK        |
#  |____|______|__________|______|_______|_____|_______|________|__________|______|_______________|
#                                                                     |       |          |
#                                                                     |       |          |
#                                                                     |       |          |
#                      COMMENTS  <|-----------------------------------┘       |          |
#    _____________________________________________                            |          |
#   | id | book_id | user_id | body | rate | date |                           |          |
#   | PK |   FK    |   FK    |  STR |  INT |  DAT |                           |          |
#   |____|_________|_________|______|______|______|                           |          | 
#                                                                             |          |
#                                                                             |          |
#                             RENT  <|----------------------------------------┘          |
#     ___________________________________________________________                        |
#    | id | user_id | book_copy_id | init_date | expiration_date |                       |
#    | PK |   FK    |     FK       |   DAT     |       DAT       |                       |
#    |____|_________|______________|___________|_________________|                       |
#                                                                                        |
#                                                                                        | 
#                           NOTIFICATION   <|--------------------------------------------┘
#    _____________________________________________________________
#   | id | user_id | title | body | date | note | category | read |
#   | PK |   FK    |  STR  | TEXT |  DAT | STR  |   STR    | BOOL |
#   |____|_________|_______|______|______|______|__________|______|
#

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True, unique=True, autoincrement=True)
    name = db.Column(db.String(30), nullable = False)
    lastname = db.Column(db.String(30), nullable = False)
    mail = db.Column(db.String(50), nullable = False, unique=True)
    phone = db.Column(db.String(16))
    role = db.Column(db.String(10), nullable = False, server_default='pending')
    alias = db.Column(db.String)
    passwd = db.Column(db.String, nullable = False)
    # Relation 1:N (1 user : N Comments)
    comments = db.relationship('Comment', back_populates='user', cascade='all, delete-orphan')
    # Relation 1:N (1 user : N rent)
    rents = db.relationship('Rent', back_populates='user', cascade='all, delete-orphan')
    # Relation 1:N (1 user : N notifications)
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan')

    ########################################################
    #               methods to hash the passwd             #
    ########################################################

    @property
    def plain_passwd(self):
        raise AttributeError('Password can\'t be read')
    
    @plain_passwd.setter
    def plain_passwd(self, passwd):
        self.passwd = generate_password_hash(passwd)

    def validate_passwd(self, passwd):
        return check_password_hash(self.passwd, passwd)

    ########################################################
    #             Methods to convert to JSON               #
    ########################################################

    def to_json(self):
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'mail': str(self.mail),
            'phone': self.phone,
            'role': str(self.role),
            'alias': str(self.alias)
        }
        return user_json

    def to_json_complete(self):
        try:
            rents=[rent.to_json() for rent in self.rents] 
        except:
            rents=''
        try:
            comments=self.comments.to_json_no_user()
        except:
            comments=''
        try:
            notifications = [notification.to_json() for notification in self.notifications]
        except:
            notifications=''
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'mail': str(self.mail),
            'phone': self.phone,
            'role': str(self.role),
            'alias': str(self.alias),
            'passwd': str(self.passwd),
            'rent': rents,
            'comments': comments,
            'notifications': notifications
        }
        return user_json

    def to_json_short(self):
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'email': str(self.mail),
        }
        return user_json
    
    ########################################################
    #             Methods to convert from JSON             #
    ########################################################

    @staticmethod
    def from_json(user_json):
        name = user_json.get('name')
        lastname = user_json.get('lastname')
        mail = user_json.get('mail')
        phone = user_json.get('phone')
        role = user_json.get('role')
        alias = user_json.get('alias')
        passwd = user_json.get('passwd')
        try:
            if not name or not lastname or not mail or not passwd:
                raise ValueError("Missing required user fields")
            if role not in ['admin', 'user', 'librarian']:
                role = 'pending'
            return User(
                name = name,
                lastname = lastname,
                mail = mail,
                phone = phone,
                role = role,
                alias = alias,
                plain_passwd = passwd
            )
        except ValueError as err:
            raise err
    
    ########################################################
    #                   repr of the user                   #
    ########################################################

    def __repr__(self):
        user = 'User:\n'
        user += f'    id: {self.id}\n'
        user += f'    name: {self.name}\n'
        user += f'    lastname: {self.lastname}\n'
        user += f'    mail: {self.mail}\n'
        user += f'    phone: {self.phone}\n'
        user += f'    role: {self.role}\n'
        user += f'    alias: {self.alias}\n'
        user += f'    comments: {self.comments}\n'
        user += f'    rent: {self.rents}\n'
        user += f'    notifications: {self.notifications}\n'
        return user