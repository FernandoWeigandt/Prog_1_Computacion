from .. import db

########################################################
#            Medium table books_authors                #
########################################################

books_authors = db.Table(
    'books_authors',
    db.Column('book_id',db.Integer,db.ForeignKey('books.id')),
    db.Column('author_id',db.Integer,db.ForeignKey('authors.id'))
)

########################################################
#               Author Table definition                #
########################################################

class Author(db.Model):
    __tablename__ = 'authors'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    lastname = db.Column(db.String(100), nullable=False)
    # Relation N:M (N authors : M books), Medium table books_authors
    books = db.relationship('Book', secondary=books_authors, back_populates='authors', lazy='subquery')
    
    ########################################################
    #             Methods to convert to JSON               #
    ########################################################

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

    ########################################################
    #             Methods to convert from JSON             #
    ########################################################

    @staticmethod
    def from_json(autor_json):
        name = autor_json.get('name')
        lastname = autor_json.get('lastname')

        return Author(
            name = name,
            lastname = lastname
        )

    ########################################################
    #                 repr of the author                   #
    ########################################################

    def __repr__(self):
        return '<Author> name:%r lastname:%r' % (self.name, self.lastname)