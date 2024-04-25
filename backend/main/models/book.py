from .. import db

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    publisher = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer)
    
    def __repr__(self):
        return '<Book> title:%r' % (self.title)

    def to_json(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'publisher': str(self.publisher),
            'status': self.status,
            'quantity': self.quantity
        }
        return book_json

    def to_json_short(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
        }
        return book_json

    @staticmethod
    def from_json(book_json):
        id = book_json.get('id')
        title = book_json.get('title')
        gender = book_json.get('gender')
        publisher = book_json.get('publisher')
        status = book_json.get('status')

        return Book(id=id,
                    title = title,
                    gender = gender,
                    publisher = publisher,
                    status = status
                    )
