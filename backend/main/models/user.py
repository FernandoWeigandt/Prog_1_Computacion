from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True, unique=True, autoincrement=True)
    name = db.Column(db.String(100), nullable = False)
    lastname = db.Column(db.String(100))
    mail = db.Column(db.String(100), nullable = False, unique=True)
    phone = db.Column(db.String(16))
    rol = db.Column(db.String(100), nullable = False)
    alias = db.Column(db.String)
    passwd = db.Column(db.String, nullable = False)
    # Relation 1:1 (1 user : 1 valoration), User is Parent
    valoration = db.relationship('Valoration', uselist=False, back_populates='user', cascade='all, delete-orphan')
    # Relation 1:1 (1 user : 1 rent), User is Parent
    rent = db.relationship('Rent', uselist=False, back_populates='user', cascade='all, delete-orphan')
    # Relation 1:N (1 user : N notifications), User is parent
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return '<User> id:%r, name:%r, lastname:%r' % (self.id, self.name, self.lastname)

    @property
    def plain_passwd(self):
        raise AttributeError('Password can\'t be read')
    
    @plain_passwd.setter
    def plain_passwd(self, passwd):
        self.passwd = generate_password_hash(passwd)

    def validate_passwd(self, passwd):
        return check_password_hash(self.passwd, passwd)

    def to_json(self):
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'mail': str(self.mail),
            'phone': self.phone,
            'rol': str(self.rol),
            'alias': str(self.alias),
            'passwd': str(self.passwd)
        }
        return user_json

    def to_json_complete(self):
        rent=self.rent.to_json()
        valoration=self.valoration.to_json()
        notifications=[notifications.to_json() for notification in self.notifications]
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'mail': str(self.mail),
            'phone': self.phone,
            'rol': str(self.rol),
            'alias': str(self.alias),
            'passwd': str(self.passwd),
            'rent': rent,
            'valoration': valoration,
            'notifications': notifications
        }
        return user_json

    def to_json_short(self):
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
        }
        return user_json

    @staticmethod
    def from_json(user_json):
        id = user_json.get('id')
        name = user_json.get('name')
        lastname = user_json.get('lastname')
        mail = user_json.get('mail')
        phone = user_json.get('phone')
        rol = user_json.get('rol')
        alias = user_json.get('alias')
        passwd = user_json.get('passwd')

        return User(
            id = id,
            name = name,
            lastname = lastname,
            mail = mail,
            phone = phone,
            rol = rol,
            alias = alias,
            plain_passwd = passwd
        )