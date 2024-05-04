from .. import db

books_authors = db.Table(
    'books_authors',
    db.Column('id', db.Integer, primary_key=True, unique=True, autoincrement=True),
    db.Column('book_id',db.Integer,db.ForeignKey('books.id')),
    db.Column('author_id',db.Integer,db.ForeignKey('authors.id'))
)

class Author(db.Model):
    __tablename__ = 'authors'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    # Relation N:M (N authors : M books), Medium table books_authors
    books = db.relationship('Book', secondary=books_authors, backref=db.backref('authors', lazy = 'dynamic'))
    
    def __repr__(self):
        return '<Author> name:%r lastname:%r' % (self.name, self.lastname)

    def to_json(self):
        autor_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname)
        }
        return autor_json

    def to_json_complete(self):
        books = [book.to_json() for book in self.books]
        autor_json = {
            'id': self.id,
            'name': str(self.name),
            'lastname': str(self.lastname),
            'books': books
        }
        return autor_json

    def to_json_short(self):
        autor_json = {'id': self.id}
        return autor_json

    @staticmethod
    def from_json(autor_json):
        id = autor_json.get('id')
        name = autor_json.get('name')
        lastname = autor_json.get('lastname')

        return Author(
            id = id,
            name = name,
            lastname = lastname
        )