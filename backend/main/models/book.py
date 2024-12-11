from .. import db
from main.models import AuthorModel, books_authors

########################################################
#                Book Table definition                 #
########################################################

# The book table has the following structure
#
#                               BOOK
#   _________________________________________________________________________
#  | id | title | gender | image | description | authors | comments | copies |
#  | PK |  STR  |  STR   |  STR  |    TEXT     |   FK    |    FK    |   FK   |
#  |____|_______|________|_______|_____________|_________|__________|________|
#                                                  |          |         |
#                                                  |          |         |
#                                                  |          |         |
#                  BOOKS-AUTHORS  <|---------------┘          |         |
#               _____________________                         |         |
#              | book_id | author_id |                        |         |
#              |   FK    |    FK     |                        |         |
#              |_________|___________|                        |         |
#                                                             |         |
#                                                             |         |
#                       COMMENTS  <|--------------------------┘         |
#    _____________________________________________                      |
#   | id | book_id | user_id | body | rate | date |                     |
#   | PK |   FK    |   FK    |  STR |  INT |  DAT |                     |
#   |____|_________|_________|______|______|______|                     |
#                                                                       |
#                                                                       |
#                   BOOKS-COPY   <|-------------------------------------┘
#              ______________________
#             | id | book_id | rent |
#             | PK |   FK    |  FK  |
#             |____|_________|______|
#
#
#    Then, there are some methods to define dinamic properties that take data
#    from other tables
#    The structure of those methods are as follows:
#    
#        QUANTITY: Based on the quantity of copies of the book.
#                  This is because the book itself is a model, then
#                  it has copies.
#        STATUS: Based on the availability of the book.
#                If quantity is 0, then the book is unavailable
#                If quantity is > 0, then if all copies are unavailable
#                  then the book is unavailable
#                If quantity is > 0, then if at least one copy is available
#                  then the book is available
#        RATING: Based on the comments of the book.
#                There must be comments to calculate the rating.
#                If there are no comments, then the rating is 0
#                Otherwise, the rating is the sum of all comments divided
#                by the number of comments
#        COMMENTS_QUANTITY: Based on the len of the comments array.
#

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
    copies = db.relationship('BookCopy', back_populates='book', cascade='all, delete-orphan')
    # Relation N:M (N authors : M books), Medium table books_authors
    authors = db.relationship('Author', secondary=books_authors, back_populates='books', lazy='subquery')

    ########################################################
    #         Methods to define dinamic properties         #
    ########################################################
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
        return round(total_rating / len(self.comments),1)
    
    @property
    def comments_quantity(self):
        return len(self.comments)
    
    @property
    def authors_name(self):
        authors_count = len(self.authors)
        all_authors = ''
        for i, author in enumerate(self.authors):
            comma = ', ' if i < authors_count - 1 else ''
            all_authors +=  f'{author.name} {author.lastname}{comma}'
        return all_authors
    
    ########################################################
    #             Methods to convert to JSON               #
    ########################################################

    def to_json(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
            'gender': str(self.gender),
            'status': self.status,
            'image': str(self.image),
            'rating': self.rating,
            'authors': self.authors_name,
            'quantity': self.quantity,
            'comments_quantity': self.comments_quantity
        }
        return book_json

    def to_json_complete(self):
        authors = [author.to_json() for author in self.authors]
        comments = [comment.to_json_book() for comment in self.comments]
        copies = [copy.to_json_book() for copy in self.copies]
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
            'comments': comments,
            'copies': copies
        }
        return book_json

    def to_json_short(self):
        book_json = {
            'id': self.id,
            'title': str(self.title),
        }
        return book_json

    ########################################################
    #             Methods to convert from JSON             #
    ########################################################

    @staticmethod
    def from_json(book_json):
        title = book_json.get('title')
        gender = book_json.get('gender')
        image = book_json.get('image')
        description = book_json.get('description')
        authors_id = book_json.get('authors')

        new_book = Book(
            title=title,
            gender=gender,
            image=image,
            description=description,
        )
        if authors_id:
            authors = AuthorModel.query.filter(AuthorModel.id.in_(authors_id)).all()
            new_book.authors = authors

        return new_book
    
    ########################################################
    #                   repr of the book                   #
    ########################################################

    def __repr__(self):
        book = 'Book:\n'
        book += f'    id: {self.id}\n'
        book += f'    title: {self.title}\n'
        book += f'    gender: {self.gender}\n'
        book += f'    status: {self.status}\n'
        book += f'    image: {self.image}\n'
        book += f'    rating: {self.rating}\n'
        book += f'    quantity: {self.quantity}\n'
        book += f'    description: {self.description}\n'
        book += f'    authors: {self.authors}\n'
        return book