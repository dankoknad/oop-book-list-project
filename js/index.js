var containerEl = document.getElementById('container'),
  formEl = document.getElementById('book-form'),
  titleInputEl = document.getElementById('title'),
  authorInputEl = document.getElementById('author'),
  isbnInputEl = document.getElementById('isbn'),
  bookListEl = document.getElementById('book-list')

// Local Storage & app state
var Store = {
  books: JSON.parse(localStorage.getItem('books')) || [],
  getBooks: function() {
    return this.books
  },
  addBook: function(book) {
    this.books.push(book)

    localStorage.setItem('books', JSON.stringify(this.books))
  },
  deleteBook: function(target) {
    var isbn = target.parentElement.previousElementSibling.innerHTML

    this.books = this.books.filter(function(book) {
      return book.isbn !== isbn
    })

    localStorage.setItem('books', JSON.stringify(this.books))
  }
}

// Book Constructor
function Book(title, author, isbn) {
  this.title = title
  this.author = author
  this.isbn = isbn
}

// UI Constructor
function UI() {}

UI.prototype.addBook = function(book, i) {
  // create new row el
  var bookRowEl = document.createElement('tr')

  // insert columns
  bookRowEl.innerHTML =
    '<td>' +
    (i + 1) +
    '</td><td>' +
    book.title +
    '</td><td>' +
    book.author +
    '</td><td>' +
    book.isbn +
    '</td><td><a href="#" class="delete">X</a></td>'

  bookListEl.appendChild(bookRowEl)
}

UI.prototype.clearFields = function() {
  titleInputEl.value = ''
  authorInputEl.value = ''
  isbnInputEl.value = ''
  titleInputEl.focus()
}

UI.prototype.showAlert = function(msg, className) {
  var divEl = document.createElement('div')

  divEl.innerHTML = msg
  divEl.className = 'alert ' + className

  containerEl.insertBefore(divEl, formEl)
  setTimeout(function() {
    document.querySelector('.alert').remove()
  }, 3000)
}

UI.prototype.deleteBook = function(target) {
  if (target.className === 'delete') {
    target.parentElement.parentElement.remove()
  }
}

// Event Listeners

document.addEventListener('DOMContentLoaded', function() {
  var ui = new UI()

  Store.getBooks().forEach(function(book, i) {
    ui.addBook(book, i)
  })
})

formEl.addEventListener('submit', function(e) {
  e.preventDefault()

  // get form values
  var title = titleInputEl.value,
    author = authorInputEl.value,
    isbn = isbnInputEl.value

  // instantiate book
  var book = new Book(title, author, isbn)

  // instantiate ui
  var ui = new UI()

  // validate
  if (!title || !author || !isbn) {
    // error alert
    ui.showAlert('Please fill all form fields', 'error')
  } else {
    // add book to list
    var count = Store.getBooks().length
    ui.addBook(book, count)
    Store.addBook(book, count)

    // success alert
    ui.showAlert('A book has been added', 'success')

    // clear form fields
    ui.clearFields()
  }
})

bookListEl.addEventListener('click', function(e) {
  // instantiate ui
  var ui = new UI()

  // delete book
  ui.deleteBook(e.target)
  Store.deleteBook(e.target)

  // success alert
  ui.showAlert('A book has been deleted', 'success')
})
