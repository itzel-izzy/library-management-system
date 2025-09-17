To build a Library Management System (LMS) in Python, we'll create a simple command-line-based project. This will teach you how to use Python classes, functions, and file handling to create a functional application.

Project Goal
The goal is to create a basic LMS that can perform the following tasks:

Add a book

View all books

Issue a book

Return a book

Check a book's availability

Maintain a record of book data

Project Requirements
You only need Python installed. No external libraries are required, as we will focus on basic, core functionalities.

Project Structure
The code will be split into two main parts:

library_system.py: The main Python file containing all the classes and functions.

books.txt: A simple text file to save the book data.

Code for library_system.py
Python

# library_system.py

class Library:
    def __init__(self, book_list_file="books.txt"):
        self.book_list_file = book_list_file
        self.books = self.load_books()

    def load_books(self):
        """Loads books from the text file into a dictionary."""
        books = {}
        try:
            with open(self.book_list_file, "r") as f:
                for line in f:
                    book_id, title, author, is_available_str = line.strip().split(',')
                    is_available = is_available_str.strip() == "True"
                    books[book_id.strip()] = {
                        "title": title.strip(),
                        "author": author.strip(),
                        "is_available": is_available
                    }
        except FileNotFoundError:
            # Create the file if it doesn't exist
            with open(self.book_list_file, "w") as f:
                pass
        return books

    def save_books(self):
        """Saves the current book data back to the file."""
        with open(self.book_list_file, "w") as f:
            for book_id, details in self.books.items():
                f.write(f"{book_id},{details['title']},{details['author']},{details['is_available']}\n")

    def add_book(self, book_id, title, author):
        """Adds a new book to the library."""
        if book_id in self.books:
            print(f"\nError: Book with ID '{book_id}' already exists.")
        else:
            self.books[book_id] = {"title": title, "author": author, "is_available": True}
            self.save_books()
            print(f"\nSuccess: Book '{title}' by {author} has been added.")

    def view_all_books(self):
        """Displays all books in the library with their status."""
        if not self.books:
            print("\nThere are no books in the library.")
            return

        print("\n--- All Books in the Library ---")
        for book_id, details in self.books.items():
            status = "Available" if details['is_available'] else "Issued"
            print(f"ID: {book_id} | Title: {details['title']} | Author: {details['author']} | Status: {status}")
        print("------------------------------\n")

    def issue_book(self, book_id):
        """Issues a book to a user."""
        if book_id not in self.books:
            print(f"\nError: Book with ID '{book_id}' not found.")
        elif not self.books[book_id]['is_available']:
            print(f"\nError: Book '{self.books[book_id]['title']}' is already issued.")
        else:
            self.books[book_id]['is_available'] = False
            self.save_books()
            print(f"\nSuccess: Book '{self.books[book_id]['title']}' has been issued.")

    def return_book(self, book_id):
        """Allows a user to return a book."""
        if book_id not in self.books:
            print(f"\nError: Book with ID '{book_id}' not found.")
        elif self.books[book_id]['is_available']:
            print(f"\nError: Book '{self.books[book_id]['title']}' is not currently issued.")
        else:
            self.books[book_id]['is_available'] = True
            self.save_books()
            print(f"\nSuccess: Book '{self.books[book_id]['title']}' has been returned.")

# Main program loop
if __name__ == "__main__":
    library = Library()

    while True:
        print("\n===== Library Management System =====")
        print("1. Add a new book")
        print("2. View all books")
        print("3. Issue a book")
        print("4. Return a book")
        print("5. Exit")

        choice = input("Enter your choice (1-5): ")

        if choice == '1':
            book_id = input("Enter Book ID: ")
            title = input("Enter Title: ")
            author = input("Enter Author: ")
            library.add_book(book_id, title, author)
        elif choice == '2':
            library.view_all_books()
        elif choice == '3':
            book_id = input("Enter Book ID to issue: ")
            library.issue_book(book_id)
        elif choice == '4':
            book_id = input("Enter Book ID to return: ")
            library.return_book(book_id)
        elif choice == '5':
            print("\nExiting the system. Goodbye!")
            break
        else:
            print("\nInvalid choice. Please enter a number between 1 and 5.")
How to Run It
Copy the code above into a text editor and save it as library_system.py.

In the same directory, create an empty file and save it as books.txt.

Open your terminal or command prompt.

Navigate to the directory where you saved your files.

Run the command:

Bash

python library_system.py
You can now start managing your library! This is a great starter project, and you can add new features in the future, such as:

Managing users

Searching for books

Adding a graphical user interface (GUI)
