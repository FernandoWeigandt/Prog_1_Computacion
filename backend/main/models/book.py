from .. import db

books_rents = db.Table(
    'books_rents',
    db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=True),
    db.Column('book_id',db.Integer, db.ForeignKey('books.id')),
    db.Column('rent_id',db.Integer, db.ForeignKey('rents.id')),
)

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    publisher = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer)
    # Relation 1:N (1 book : N valorations), Book is parent
    valorations = db.relationship('Valoration', back_populates='book', cascade='all, delete-orphan')
    # Relation N:M (N books : M rents), Medium table books_rents
    rents = db.relationship('Rent', secondary=books_rents, backref=db.backref('books', lazy='dynamic'))
    # Relation N:M (N authors : M books), Medium table books_authors
    # No need to define the relation as it was backref in authors

    
    def __repr__(self):
        return '<Book> title:%r' % (self.title)

    def to_json(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'publisher': str(self.publisher),
            'status': self.status,
            'quantity': self.quantity,
        }
        return book_json

    def to_json_complete(self):
        authors = [author.to_json() for author in self.authors]
        valorations = [valoration.to_json() for valoration in self.valorations]
        rents = [rent.to_json() for rent in self.rents]
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'publisher': str(self.publisher),
            'status': self.status,
            'quantity': self.quantity,
            'authors': authors,
            'valorations': valorations,
            'rents': rents
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
        quantity = book_json.get('quantity')

        return Book(
            id = id,
            title = title,
            gender = gender,
            publisher = publisher,
            status = status,
            quantity = quantity
        )

