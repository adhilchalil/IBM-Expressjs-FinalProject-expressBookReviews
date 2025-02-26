const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
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

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: {username,password}
            // IMPORTANT AF!!!! Very bad practice to include password in payload.
            // In HMAC token creation it is only base64 encoded and can be decoded out.
        }, 'token_secret', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let review = req.body.review;
    if(isbn){
        if(books[isbn]){
            let reviews = books[isbn].reviews;
            let reviewExists = reviews[req.user]? true: false;
            reviews[req.user] = review;
            return res.send(reviewExists? "Review updated!": "Review added!");
        }
        return res.status(404).json({message: "Book not found!"});
    }
    return res.status(403).json({message: "No ID requested!"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.body.review;
    if(isbn){
        if(books[isbn]){
            let reviews = books[isbn].reviews;
            let reviewExists = reviews[req.user]? true: false;
            reviews[req.user] = review;
            return res.send(reviewExists? "Review updated!": "Review added!");
        }
        return res.status(404).json({message: "Book not found!"});
    }
    return res.status(403).json({message: "No ID requested!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
