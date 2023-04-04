const express = require('express');
// let books = require("./booksdb.js");
let books = require("./auth_users.js").books;
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

// // Get the book list available in the shop Task 1
// public_users.get('/',function (req, res) {
//   //Write your code here
// //   return res.status(300).json({message: "Yet to be implemented"});
//     res.send(JSON.stringify(books,null,4))
// });

// Get the book list available in the shop Task 10
public_users.get('/',function (req, res) {
    //Write your code here
  //   return res.status(300).json({message: "Yet to be implemented"});
      res.send(JSON.stringify(books,null,4))
  });

    const axios = require('axios').default;
    const connectToURL = async(url)=>{
        const outcome = axios.get(url);
        let book_list = (await outcome).data.books;
        book_list.forEach((book)=>{
            console.log(JSON.stringify(book,null,4));
        });
    }

    console.log("Before connect URL")
    connectToURL('http://localhost').catch(err=>console.log(err.toString()));
    console.log("After connect URL")


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn_number = req.params.isbn
  filtered_book = books[isbn_number]
//   return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(filtered_book,null,4))
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
