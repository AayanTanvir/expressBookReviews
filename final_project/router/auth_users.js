const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });

    if(usersWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let authenticatedUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if(authenticatedUsers.length > 0){
        return true;
    } else {
        return false;
    }

}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        let user = authenticatedUser(username, password);
        if(user){
            const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
            req.session.authorization = {
                accessToken,
                username
            }
        } else {
            return res.status(403).send("Invalid Credentials");
        }

        return res.status(200).send("Logged in successfully!");
    } else {
        return res.status(404).json({message: "username and password not provided"});
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const bookReview = books[isbn].reviews;
    const review = req.query.review;
    const username = req.user.username;

    if(books[isbn]) {
        if(review) {
            bookReview[username] = review;
            return res.send.json({message: "Review submitted successfully!", review: bookReview});
        } else {
            return res.status(400).send("Review must be provided");
        }

    } else {
        return res.status(404).send("Book not found");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
