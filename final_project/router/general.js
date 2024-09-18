const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if(book){ //if the book with the ISBN exists
        res.send(JSON.stringify(book, null, 4));
    } else { //if the book with the specified ISBN doesn't exist give an error
        req.status(404).json({message: "Book does not exist"});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.trim();
    for(let key in books) {
        const bookAuthor = books[key].author.replace(/\s+/g, '');
        if(bookAuthor === author.replace(/\s+/g, '')) {
            return res.json(books[key]);
        }
    }
    return res.status(404).json({message: "author not found"});

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.trim();
    for(let key in books) {
        const bookTitle = books[key].title;
        if(bookTitle === title){
            return res.json(books[key]);
        }
    }
    return res.status(404).json({message: "title not found"});

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
