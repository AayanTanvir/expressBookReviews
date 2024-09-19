const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
let books = require("./booksdb.js");
const { rejects } = require('assert');
const { read } = require('fs');
const { error } = require('console');
const { promisify } = require('util');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        const userExists = isValid(username);
        if(!userExists){
            users.push({"username": username, "password": password});
            res.status(200).send(`User ${username} registered successfully! Now you can Login`);
        } else {
            res.status(404).send("User already exists");
        }
    } else {
        res.status(404).json({message: "username & password not provided"});
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    Promise.resolve(books) 
        .then((booksData) => {
           return res.send(JSON.stringify(booksData, null, 4));
        })
        .catch((error) => {
           return res.status(500).send(error);
        })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    Promise.resolve()
        .then(() => {
            const book = books[isbn];
        
            if(book){ //if the book with the ISBN exists
                res.send(JSON.stringify(book, null, 4));
            } else { //if the book with the specified ISBN doesn't exist give an error
                req.status(404).json({message: "Book does not exist"});
            }
        }) 
        .catch((error) => {
            return res.status(500).send(error);
        })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.trim();
    
    Promise.resolve()
        .then(() => {
            for(let key in books) {
                const bookAuthor = books[key].author.replace(/\s+/g, '');
                if(bookAuthor === author.replace(/\s+/g, '')) {
                    return res.json(books[key]);
                }
            }
            return res.status(404).json({message: "author not found"});
        })
        .catch((error) => {
            return res.status(500).send(error);
        })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.trim();

    Promise.resolve()
        .then(() => {
            for(let key in books) {
                const bookTitle = books[key].title;
                if(bookTitle === title){
                    return res.json(books[key]);
                }
            }
            return res.status(404).json({message: "title not found"});
        })
        .catch((error) => {
           return res.status(500).send(error);
        })

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookReview = books[isbn].reviews;

    if(bookReview) {
        res.json(bookReview);
    } else {
        res.status(404).json({message: "incorrect ISBN key"});
    }

});

module.exports.general = public_users;
