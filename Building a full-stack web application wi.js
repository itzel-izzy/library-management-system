Building a full-stack web application with React.js for the front-end and a Flask back-end is an excellent way to create a more dynamic and responsive user interface. This approach separates the presentation layer (what the user sees) from the data and logic layer (the server).

Here is a guide to setting up a Library Management System with this architecture.

1. Project Setup
Your project will have two main folders: one for the React front-end and one for the Flask back-end.

library-management-fullstack/
├── flask-backend/
│   ├── app.py
│   ├── database.db
│   └── requirements.txt
└── react-frontend/
    ├── public/
    ├── src/
    └── package.json
2. Back-end: Flask API
The back-end will not serve HTML pages anymore. Instead, it will act as a REST API, providing data in JSON format to the React front-end. We'll use the same Flask-SQLAlchemy code as before, but modify the routes to return JSON responses.

flask-backend/requirements.txt
Flask
Flask-SQLAlchemy
Flask-CORS  # Needed to allow communication between React and Flask
Install them with pip install -r requirements.txt.

flask-backend/app.py
Python

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
3. Front-end: React.js
The React front-end will handle the user interface, making API calls to the Flask back-end to fetch and modify data.

Set up React Project
Navigate into the library-management-fullstack/ folder.

Run the following command to create a new React app:

Bash

npx create-react-app react-frontend
cd react-frontend
Install a library for making API requests:

Bash

npm install axios
react-frontend/src/App.js
This file will contain the main application logic, including state management for the books and functions to interact with the API.

JavaScript

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://127.0.0.1:5000/api/books';

function App() {
  const [books, setBooks] = useState([]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');

  // Fetch books from the backend when the component loads
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        title: newBookTitle,
        author: newBookAuthor
      });
      setNewBookTitle('');
      setNewBookAuthor('');
      fetchBooks(); // Re-fetch the books to update the list
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const toggleBookStatus = async (bookId) => {
    try {
      await axios.put(`${API_URL}/${bookId}`);
      fetchBooks(); // Re-fetch the books to update the list
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Library Management System</h1>
      </header>

      <main>
        <div className="add-book-section">
          <h2>Add a New Book</h2>
          <form onSubmit={addBook}>
            <input 
              type="text" 
              placeholder="Book Title" 
              value={newBookTitle} 
              onChange={(e) => setNewBookTitle(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Author Name" 
              value={newBookAuthor} 
              onChange={(e) => setNewBookAuthor(e.target.value)} 
              required 
            />
            <button type="submit">Add Book</button>
          </form>
        </div>

        <div className="books-list-section">
          <h2>Available Books</h2>
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <h3>{book.title}</h3>
                <p>by {book.author}</p>
                <p className="status">Status: <strong>{book.is_available ? 'Available' : 'Issued'}</strong></p>
                <button 
                  onClick={() => toggleBookStatus(book.id)}
                  className={book.is_available ? 'issue-button' : 'return-button'}
                >
                  {book.is_available ? 'Issue Book' : 'Return Book'}
                </button>
              </div>
            ))
          ) : (
            <p>No books in the library yet. Add one above!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
react-frontend/src/App.css
You can add styling here to make the front-end look good.

CSS

/* Basic styling */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  color: #333;
}

.App {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #0056b3;
}

/* Forms and buttons */
.add-book-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

input, button {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border: none;
}

/* Book cards */
.book-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.issue-button {
  background-color: #28a745;
}

.return-button {
  background-color: #dc3545;
}

.status {
  font-weight: bold;
}
4. How to Run
You need to run the front-end and back-end in two separate terminals.

Terminal 1 (Back-end)
Navigate to the flask-backend directory.

Run the Flask app:

Bash

python app.py
The server will start on http://127.0.0.1:5000.

Terminal 2 (Front-end)
Navigate to the react-frontend directory.

Run the React app:

Bash

npm start
This will open the application in your browser at http://localhost:3000. The React app will communicate with your Flask API to manage the library data.