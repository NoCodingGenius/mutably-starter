console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  const DOMELEMENTS = {
    rootURL: () => 'https://mutably.herokuapp.com/books',
    urlWithID: () => `https://mutably.herokuapp.com/books/:${id}`,
    createNode: element => document.createElement(element),
    append: (parent, element) => parent.appendChild(element),
    ul: () => document.querySelector('.list-group'),
    form: () => document.querySelector('form'),
    updateButton: () => document.querySelectorAll('button'),
    deleteButton: () => document.querySelector('.delete-button'),
  };

  const UI = {
    appendBook: (book) => {
      let containerUL = DOMELEMENTS.createNode('ul'),
          authorLI = DOMELEMENTS.createNode('li'),
          bookTitleLI = DOMELEMENTS.createNode('li'),
          releaseDateLI = DOMELEMENTS.createNode('li'),
          img = DOMELEMENTS.createNode('img'),
          editButton = DOMELEMENTS.createNode('button'),
          deleteButton = DOMELEMENTS.createNode('button')
      img.src = book.image;
      authorLI.innerHTML = `${book.author}`;
      bookTitleLI.innerHTML = `${book.title}`;
      releaseDateLI.innerHTML = `${book.releaseDate}`;
      editButton.innerHTML = `Edit`;
      deleteButton.innerHTML = `Delete`;
      deleteButton.className = 'delete-button';
      DOMELEMENTS.append(containerUL, img);
      DOMELEMENTS.append(containerUL, bookTitleLI);
      DOMELEMENTS.append(containerUL, authorLI);
      DOMELEMENTS.append(containerUL, releaseDateLI);
      DOMELEMENTS.append(containerUL, editButton);
      DOMELEMENTS.append(containerUL, deleteButton);
      DOMELEMENTS.append(DOMELEMENTS.ul(), containerUL);
    },
    addBooksToPage: (books) => {
      books.map(book => {
        UI.appendBook(book)
      })
    },
    addNewBook: (book) => {
      UI.appendBook(book)
    },
    extractBookFromForm: () => {
      return {
        title: DOMELEMENTS.form().elements.booktitle.value,
        author: DOMELEMENTS.form().elements.authorname.value,
        image: DOMELEMENTS.form().elements.imagelink.value,
        releaseDate: DOMELEMENTS.form().elements.releasedate.value
      }
    },
    updateBook: function () {
      $(this).siblings().each(
       function(){
           if ($(this).find('input').length) {
               $(this).text($(this).find('input').val());
           } else {
               var inputTextValue = $(this).text();
               $(this).text('').append($('<input />',{'value' : inputTextValue}).val(inputTextValue));
           }
           return {
             //
           }
       });
    }
  };

  const DATA = {
    fetchAllBooks: () => {
      return fetch(DOMELEMENTS.rootURL(), {
          method: 'GET',
          mode: 'cors',
        	headers: new Headers({
      		'Content-Type': 'application/json'
          })
      })
        .then(response => response.json())
        .then(data => data.books)
        console.log(data.books._id);
    },
    createBook: () => {
      let book = UI.extractBookFromForm()
      return fetch(DOMELEMENTS.rootURL(), {
          method: 'POST',
          mode: 'cors',
        	headers: new Headers({
      		'Content-Type': 'application/json'
          }),
          body: JSON.stringify(book)
        })
          .then(response => response.json())
    },
    updateBook: () => {
      let editedBook = UI.updateBook()
      return fetch(urlWithID, {
        method: 'PUT',
        mode: 'cors',
        headers: new Headers({
        'Content-Type': 'application/json'
        }),
        credentials: 'same-origin',
        body: JSON.stringify(editedBook)
      })
      .then(response => response.json())
    },
    deleteBook: () => {
      return fetch(urlWithID, {
        method: 'DELETE',
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
      .then(response => response.json())
    }
  };

  const CONTROLLER = {
    fetchAllBooks: () => {
      DATA.fetchAllBooks()
      .then( books => {
        UI.addBooksToPage(books)
      })
    },
    createBook: (event) => {
      event.preventDefault();
      DATA.createBook()
      .then(book => {
        UI.addNewBook(book)
      })
    },
    // updateBook: function () {
    //   UI.updateBook();
    // },
    // deleteBook: () => {
    //   .then( => {
    //
    //   })
    // }
  };

  CONTROLLER.fetchAllBooks();
  DOMELEMENTS.form().addEventListener("submit", CONTROLLER.createBook);
  $(document).on('click', 'button', UI.updateBook);
  //$(DOMELEMENTS.ul()).on('click', '.delete-button', CONTROLLER.deleteBook);
});
