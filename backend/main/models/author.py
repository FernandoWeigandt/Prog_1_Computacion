from .. import db

class Author(db.Model):
    __tablename__ = "authors"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    
    def __repr__(self):
        return '<Author> name:%r lastname:%r' % (self.name, self.lastname)

    def to_json(self):
        autor_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname)
        }
        return autor_json

    def to_json_short(self):
        autor_json = {
            'id': self.id
        }
        return autor_json

    @staticmethod
    def from_json(autor_json):
        id = autor_json.get('id')
        name = autor_json.get('name')
        lastname = autor_json.get('lastname')

        return Author(id = id,
                    name = name,
                    lastname = lastname
                    )