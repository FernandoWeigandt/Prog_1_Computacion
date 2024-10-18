from .. import db

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(100))
    description = db.Column(db.Text)
    # Relation 1:N (1 book : N Comments), Book is parent
    comments = db.relationship('Comment', back_populates='book', cascade='all, delete-orphan')
    # Relation 1:N (1 book : N BookCopies)
    copies = db.relationship('BookCopies', back_populates='book', cascade='all, delete-orphan')
    # Relation N:M (N authors : M books), Medium table books_authors
    # No need to define the relation as it was backref in authors

    @property
    def status(self):
        for copy in self.copies:
            if copy.status == 'available':
                return 'available'
        return 'unavailable'

    @property
    def quantity(self):
        return len(self.copies)

    @property
    def rating(self):
        if not self.comments:
            return 0
        total_rating = sum(comment.rate for comment in self.comments)
        return total_rating / len(self.comments)
    
    def __repr__(self):
        return '<Book> title:%r' % (self.title)
    
    def to_json(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'status': self.status,
            'image': str(self.image),
            'rating': self.rating,
            'quantity': self.quantity
        }
        return book_json

    def to_json_complete(self):
        authors = [author.to_json() for author in self.authors]
        comments = [comment.to_json() for comment in self.comments]
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'status': self.status,
            'image': str(self.image),
            'rating': self.rating,
            'quantity': self.quantity,
            'description': str(self.description),
            'authors': authors,
            'comments': comments
        }
        return book_json

    def to_json_short(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
        }
        return book_json

    @staticmethod
    def from_json(book_json):
        id = book_json.get('id')
        title = book_json.get('title')
        gender = book_json.get('gender')
        image = book_json.get('image')
        description = book_json.get('description')

        return Book(
            id = id,
            title = title,
            gender = gender,
            image = image,
            description = description
        )
