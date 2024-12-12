from flask import request, jsonify
from flask_restful import Resource
from main.models import BookCopyModel, BookModel
from main.auth.decorators import role_required
from flask_jwt_extended import jwt_required
from .. import db

class BookCopy(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def get(self, id):
        """
        Handles GET requests to retrieve a book copy by id.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        Returns a JSON representation of the book copy with all its attributes.
        """
        book_copy = db.session.query(BookCopyModel).get_or_404(id)
        return book_copy.to_json_complete()
    
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def delete(self, id):
        """
        Handles DELETE requests to remove a book copy.

        Requires a valid JWT token for authentication and the role must be 'admin' or 'librarian'.
        The requested book copy is removed from the database. If the deletion is successful, a JSON 
        representation of the book copy is returned with a 200 status code. If an error occurs during processing,
        an error message is returned with a 400 status code.
        """
        book_copy = db.session.query(BookCopyModel).get_or_404(id)
        if book_copy.rent:
            return {'error':'Book copy is currently rented'}, 400
        try:
            db.session.delete(book_copy)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error':'Incorrect data format'}, 400
        return book_copy.to_json()
    
class BookCopies(Resource):
    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def get(self):
        """
        Handles GET requests to obtain a list of book copies.

        Requires a valid JWT token for authentication and allows roles: admin, librarian.

        Request Parameters (via query string):
        - page: the page number to retrieve. Default is 1.
        - per_page: the number of items per page. Default is 10.
        - book_id: filter book copies by a specific book ID.

        The response will contain a JSON object with:
        - book_copies: an array of book copy objects, each with the structure returned by the to_json() method.
        - total: the total number of book copies.
        - pages: the total number of pages.
        - page: the current page number.
        """
        page = 1
        per_page = 10
        book_copies = db.session.query(BookCopyModel)

        if request.args.get('page'):
            page = int(request.args.get('page'))
        if request.args.get('per_page'):
            per_page = int(request.args.get('per_page'))
        
        book_id = request.args.get('book_id')
        if book_id:
            book_copies = book_copies.filter(BookCopyModel.book_id == book_id)

        book_copies = book_copies.paginate(page=page, per_page=per_page, error_out=True)
        return jsonify({
            'book_copies': [book_copy.to_json() for book_copy in book_copies],
            'total': book_copies.total,
            'pages': book_copies.pages,
            'page': page
        })

    @jwt_required()
    @role_required(roles=['admin', 'librarian'])
    def post(self):
        """
        Handles POST requests to create one or more book copies.

        Requires a valid JWT token for authentication and allows roles: admin, librarian.

        Request Body:
        - book_id: the id of the book to which the copies will be added.
        - quantity: (optional) the number of copies to add. Default is 1.

        Returns a JSON object with a success message and a 201 status code if successful.
        If there is an error, it returns a JSON object with an error message and a 400 status code.
        """
        data = request.get_json()
        book_id = data.get('book_id')
        db.session.query(BookModel).get_or_404(book_id)
        quantity = data.get('quantity', 1)
        if not isinstance(quantity, int) or quantity <= 0:
            return {'error': 'Invalid quantity. It must be a positive integer.'}, 400
        book_copies = [BookCopyModel.from_json({'book_id': book_id}) for _ in range(quantity)]
        try:
            db.session.add_all(book_copies)
            db.session.commit()
        except:
            db.session.rollback()
            return {'error': 'Incorrect data format'}, 400
        return {'message': f'{quantity} copies created successfully.', 'book_copies': [book_copy.to_json_book() for book_copy in book_copies]}, 201
