from .. import db

########################################################
#              BookCopy Table definition               #
########################################################

# The book_copies has the following structure
#
#                     BOOKS-COPY
#               ______________________
#              | id | book_id | rent |
#              | PK |   FK    |  FK  |
#              |____|_________|______|
#

#    Then, there are some methods to define dinamic properties
#    that take data from other tables
#    The structure of those methods are as follows:

#        STATUS: Based on the rent. 
#                If there is a rent, then the book is unavailable
#                If there is no rent, then the book is available
#

class BookCopy(db.Model):
    __tablename__ = 'book_copy'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)
    # 1:N (1 Book: N BookCopies)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    book = db.relationship('Book', back_populates='copies', lazy='joined')
    # 1:1 (1 BookCopy: 1 rent)
    rent = db.relationship('Rent', back_populates='book_copy')

    ########################################################
    #         Methods to define dinamic properties         #
    ########################################################

    @property
    def status(self):
        if self.rent:
            return 'unavailable'
        else:
            return 'available'

    ########################################################
    #             Methods to convert to JSON               #
    ########################################################

    def to_json_short(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'title': self.book.title
        }
    
    def to_json_book(self):
        return {
            'id': self.id,
        }

    def to_json(self):
        return {
            'id': self.id,
            'book': self.book.to_json_short(),
            'status': self.status
        }
    
    def to_json_complete(self):
        return {
            'id': self.id,
            'book': self.book.to_json(),
            'rent': self.rent.to_json_short() if self.rent else None,
            'status': self.status
        }

    ########################################################
    #             Methods to convert from JSON             #
    ########################################################

    @staticmethod
    def from_json(book_copy_json):
        try:
            book_id = book_copy_json.get('book_id')
            return BookCopy(book_id=book_id)
        except:
            raise Exception('Invalid book id')
    
    ########################################################
    #                   repr of the copy                   #
    ########################################################
    
    def __repr__(self):
        copy = 'BookCopy:\n'
        copy += f'    id: {self.id}\n'
        copy += f'    book_id: {self.book_id}\n'
        copy += f'    rent: {self.rent}\n'
        copy += f'    status: {self.status}\n'
        return copy