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