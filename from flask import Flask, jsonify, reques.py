from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS # Import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
CORS(app) # Enable CORS for all routes

# Database Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    is_available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'is_available': self.is_available
        }

with app.app_context():
    db.create_all()

# Get all books
@app.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

# Add a new book
@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(title=data['title'], author=data['author'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201

# Update a book's status (issue/return)
@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book_status(book_id):
    book = Book.query.get_or_404(book_id)
    book.is_available = not book.is_available
    db.session.commit()
    return jsonify(book.to_dict())

if __name__ == '__main__':
    app.run(debug=True, port=5000)