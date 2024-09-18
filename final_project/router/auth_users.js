const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const available = users.some((user) => user.username !== username);
    return available;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const isAuthenticated = users.some((user) => user.username === username && user.password === password);
    return isAuthenticated;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        const user = authenticatedUser(username, password);
        if(user){
            res.send("Logged in successfully!");
            return token = jwt.sign(payload= {
                                    username: username
                                }, "accessToken", {expiresIn: '1h'});
        } else {
            res.status(403).json({message: "Invalid Credentials"});
        }
    } else {
        res.status(404).json({message: "username and password not provided"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const bookReview = books[isbn].reviews;
    const review = req.query.review;
    const username = req.user.username;

    if(book) {
        if(review) {
            bookReview[username] = review;
            
            res.send.json({message: "Review submitted successfully!", review: bookReview});
        } else {
            res.status(400).json({message: "Review must be provided"});
        }

    } else {
        res.status(404).json({message: "Book not found"});
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
