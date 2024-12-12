from .. import db
from . import UserModel, BookModel
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # 1 Book: N Comments
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    book = db.relationship('Book', back_populates='comments', single_parent=True)
    # 1 User: N Comments
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='comments')
    # Comment structure
    body = db.Column(db.Text, nullable=False)
    rate = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable = False, default=datetime.now().date())

    # Unique book_id and user_id combinations
    __table_args__ = (
        db.UniqueConstraint('book_id', 'user_id', name='unique_user_book_comment'),
    )

    def __repr__(self):
        return '<Comment> id:%r, book_id:%r, user_id:%r, body:%r, rate:%r, date:%r' % (self.id, self.book_id, self.user_id, self.body, self.rate, self.date)
    
    def to_json(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        self.book = db.session.query(BookModel).get_or_404(self.book_id)
        comment_json = {
            'id': self.id,
            'body': str(self.body),
            'rate': self.rate,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'user': self.user.to_json(),
            'book':self.book.to_json()
        }
        return comment_json
    
    def to_json_user(self):
        self.book = db.session.query(BookModel).get_or_404(self.book_id)
        comment_json = {
            'id': self.id,
            'body': str(self.body),
            'rate': self.rate,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'book':self.book.to_json_short()
        }
        return comment_json
    
    def to_json_book(self):
        self.user = db.session.query(UserModel).get_or_404(self.user_id)
        comment_json = {
            'id': self.id,
            'body': str(self.body),
            'rate': self.rate,
            'date': str(self.date.strftime('%Y-%m-%d')),
            'user': self.user.to_json_short()
        }
        return comment_json
    
    def to_json_short(self):
        comment_json = {
            'id': self.id,
            'body': str(self.body),
            'rate': self.rate,
            'date': str(self.date.strftime('%Y-%m-%d')),
        }
        return comment_json

    @staticmethod
    def from_json(comment_json):
        body, rate, date, user_id, book_id = None, None, None, None, None
        if comment_json.get('body'):
            body = comment_json.get('body')
        if comment_json.get('rate'):
            rate = comment_json.get('rate')
        if comment_json.get('date'):
            date = datetime.strptime(comment_json.get('date'), '%Y-%m-%d').date()
        if comment_json.get('user_id'):
            user_id = comment_json.get('user_id')
        if comment_json.get('book_id'):
            book_id = comment_json.get('book_id')
        user = db.session.query(UserModel).get_or_404(user_id)
        book = db.session.query(BookModel).get_or_404(book_id)
        comment = Comment(
            body=body if body else None,
            rate=rate if rate else None,
            date=date if date else None,
            user=user if user else None,
            book=book if book else None
        )
        return comment