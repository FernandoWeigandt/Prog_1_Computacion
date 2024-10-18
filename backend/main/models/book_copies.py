from .. import db

class BookCopies(db.Model):
    __tablename__ = 'book_copies'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    # 1:N (1 Book: N BookCopies)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    book = db.relationship('Book', back_populates='copies')
    # 1:N (1 BookCopy: N rents)
    rent = db.relationship('Rent', back_populates='book_copy', cascade='all, delete-orphan')

    @property
    def status(self):
        if self.rent:
            return 'unavailable'
        else:
            return 'available'

    def __repr__(self):
        return f'<BookCopy {self.id}>'
    
    def to_json_short(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'title': self.book.title
        }

    def to_json(self):
        return {
            'id': self.id,
            'book': self.book.to_json_short(),
            'status': self.status
        }
    
    @staticmethod
    def from_json(book_copy_json):
        id = book_copy_json.get('id')
        book_id = book_copy_json.get('book_id')
        return BookCopies(id=id, book_id=book_id)