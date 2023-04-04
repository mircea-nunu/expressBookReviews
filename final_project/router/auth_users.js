const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn_number = req.params.isbn
  let book = books[isbn_number]
  if(book) {
        const new_review_text = req.query.review
        const user_review = req.session.authorization.username

        books[isbn_number]["reviews"][user_review] = new_review_text
        //   return res.status(300).json({message: "Yet to be implemented"});
        res.send(`The review for the book with ISBN ${isbn_number} has been added/updated.`)
    } else {
        res.send("Unable to find book!");
    }
});

// Delete users book reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn_number = req.params.isbn
    let book = books[isbn_number]
    if(book) {
          const user_review = req.session.authorization.username
  
          delete books[isbn_number]["reviews"][user_review]
          //   return res.status(300).json({message: "Yet to be implemented"});
          res.send(`Reviews for the ISBN ${isbn_number} posted by the user ${user_review} deleted.`)
      } else {
          res.send("Unable to find book!");
      }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.books = books;