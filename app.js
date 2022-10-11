// Book Class : Represent a Book
class Book {
	constructor(title, author, description) {
		this.title = title;
		this.author = author;
		this.description = description;
	}
}
// UI Class : Handle UI Tasks
class UI {
	static displayBooks() {
		
		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book))
	}
	static addBookToList(book) {
		const list = document.querySelector('#book-list');
		const row = document.createElement('tr');
		row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.description}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
		list.appendChild(row);
	}

	// to clear the input fields after clicking the submit button
	static clearFeilds() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#description').value = '';
	}

	// delete the book whose button is clicked
	static deleteBook(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}
	// show alert message on successful deletion / addition of a Book.
	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);
		setTimeout(() => document.querySelector('.alert').remove(), 2000);
	}
}
//  Store Class : Handle Storage
class Store {
	static getBooks()
	{
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		}
		else {
			books = JSON.parse(localStorage.getItem('books'));
			console.log(books)
		}
		return books;
	}
	static addBook(book)
	{
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}
	static removeBook(title) {
		const books = Store.getBooks();
		books.forEach((book, index)=> {
			if (book.title === title)
				books.splice(index, 1);
		})
		localStorage.setItem('books', JSON.stringify(books));
	}
}


// Event : Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks)
// Event : Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
	e.preventDefault();
	// Get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	let description = document.querySelector('#description').value;
	if (description=== '')
		description = '---';
	// Validate
	if (title === '' || author === '') {
		UI.showAlert("Please enter the required fields!!", 'danger');
	}
	else {
		// Instantiate Book
		const book = new Book(title, author, description);
		// Add Book to UI
		UI.addBookToList(book);
		// Add book to store
		Store.addBook(book);
		// Show success message
	
		UI.showAlert('Book Added', 'success');
		// Clear Fields
		UI.clearFeilds();
	}
});



// Event : Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
	// Remove Book from UI
	UI.deleteBook(e.target);
	if (e.target.classList.contains('btn'))
	{
		UI.showAlert('Book Removed', 'primary');
	}
	// Remove Book from Store
	Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
});
