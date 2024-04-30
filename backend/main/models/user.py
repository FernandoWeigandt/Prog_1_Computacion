from .. import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    lastname = db.Column(db.String(100), nullable = False)
    mail = db.Column(db.String(100), nullable = False)
    phone = db.Column(db.Integer,nullable = False)
    rol = db.Column(db.String(100),nullable = False)
    alias = db.Column(db.String,nullable = False)
    passwd = db.Column(db.String,nullable = False)
    # Relation 1:1 (1 user : 1 valoration), User is Parent
    valoration = db.relationship('Valoration', uselist=False, back_populates='user', cascade='all, delete-orphan')

    rents = db.relationship('Rent', back_populates='user', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan')

    def __repr__(self):
        return '<User> id:%r, name:%r, lastname:%r' % (self.id, self.name, self.lastname)

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
        rents=[rents.to_json() for rent in self.rents]
        valorations=[valorations.to_json() for valoration in self.valorations]
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
            'rents': rents,
            'valorations': valorations,
            'notifications': notifications
        }
        return user_json

    def to_json_short(self):
        user_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'alias': str(self.alias),
            'passwd': str(self.passwd),
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
            passwd = passwd  
        )