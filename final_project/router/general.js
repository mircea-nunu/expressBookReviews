const express = require('express');
let books = require("./booksdb.js");
// let books = require("./auth_users.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
      
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop Task 1
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(books,null,4))
});

const getAllBooksPromise = () => {
    return new Promise((resolve, reject) => resolve(books));
  };
  
  getAllBooksPromise();
  
  public_users.get("/promise", function (req, res) {
    res.send(JSON.stringify(books, null));
  });

const axios = require('axios');
const url = 'http://localhost:3000/books';


async function getAllBooks() {
    try {
      let response = await axios.get(url);
      let data = response.data;
    // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

// Get the book list available in the shop Task 10
public_users.get('/async', async (request, response) => {
    
    const books = await getAllBooks();
    response.send(books)

});

 // Get book details based on ISBN
 public_users.get('/isbn/:isbn',function (req, res) {
    let isbn_number = req.params.isbn
    filtered_book = books[isbn_number]
  //   return res.status(300).json({message: "Yet to be implemented"});
      res.send(JSON.stringify(filtered_book,null,4))
   });

async function getBookbyISBN(isbn_number) {
    url_get = url+"?isbn="+isbn_number
    // console.log(url_get)
    try {
      let response = await axios.get(url_get);
      let data = response.data;
    // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

// Get book details based on ISBN Task 11
public_users.get('/async/isbn/:isbn', async (req, response) => {
  let isbn_number = req.params.isbn
//   console.log(isbn_number)
  const book = await getBookbyISBN(isbn_number);
    response.send(book)
 });


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const filtered_by_author = {"booksbyauthor":[]}
  let author_name = req.params.author
  //arr_isbn = Object.keys(books)
  for (const [key, value] of Object.entries(books)) {
    if (value.author === author_name) {
        let book = {"isbn" : key,
                    "title": value.title,
                    "reviews": value.reviews}
        filtered_by_author["booksbyauthor"].push(book)
    }
  }
//   return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(filtered_by_author,null,4))
});

async function getBookbyAuthor(author_name) {
    url_get = url+"?author="+author_name
    // console.log(url_get)
    try {
      let response = await axios.get(url_get);
      let data = response.data;
    // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

// Get book details based on author Task 12
public_users.get('/async/author/:author', async (req, response) => {
let author_name = req.params.author
//   console.log(author_name)
  const books = await getBookbyAuthor(author_name);
    response.send(books)
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const filtered_by_title = {"booksbytitle":[]}
  let book_title = req.params.title
  //arr_isbn = Object.keys(books)
  for (const [key, value] of Object.entries(books)) {
    if (value.title === book_title) {
        let book = {"isbn" : key,
                    "author": value.author,
                    "reviews": value.reviews}
        filtered_by_title["booksbytitle"].push(book)
    }
  }
//   return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(filtered_by_title,null,4))
});


async function getBookbyTitle(title_name) {
    url_get = url+"?title="+title_name
    // console.log(url_get)
    try {
      let response = await axios.get(url_get);
      let data = response.data;
    // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

// Get book details based on title Task 13
public_users.get('/async/title/:title', async (req, response) => {
    let book_title = req.params.title
//   console.log(author_name)
  const books = await getBookbyTitle(book_title);
    response.send(books)
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let rewiew_by_isbn = {}
  const book_isbn = req.params.isbn
  //arr_isbn = Object.keys(books)
  for (const [key, value] of Object.entries(books)) {
    if (key === book_isbn) {
        rewiew_by_isbn = value.reviews
    }
  }
    res.send(JSON.stringify(rewiew_by_isbn,null,4))
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
