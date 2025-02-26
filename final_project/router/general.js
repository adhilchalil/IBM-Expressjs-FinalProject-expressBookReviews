const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
    // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
    new Promise((resolve, reject) => {
        setTimeout(() => resolve(JSON.stringify(books, null, 4)), 2000);
    }).then((allBooks) => {
        res.send(allBooks);
    }).catch((err) => {
        res.status(404).json({message: "Something went wrong!"})
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    new Promise((resolve, reject) => {
        setTimeout(() => {
            let isbn = Number(req.params.isbn);
            if(isbn){
                if(books[isbn]){
                    resolve({status: 200, data: books[isbn]});
                }
                resolve({status: 403, data: "Book not found!"});
            }
            resolve({status: 404, data: "Invalid ID!"});
        }, 2000);
    }).then((resp) => {
        res.status(resp.status).send(JSON.stringify(resp.data, null, 4));
    }).catch((err) => {
        res.status(404).json({message: "Something went wrong!"});
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    new Promise((resolve, reject) => {
        setTimeout(() => {
            let author = req.params.author;
            let bookList = {};
            if(author){
                for(let isbn in books){
                    if(books[isbn].author == author){
                        bookList[isbn] = books[isbn];
                    }
                };
                resolve({status: 200, data: bookList});
            }
            resolve({status: 403, data: "No author requested!"});
        }, 2000);
    }).then((resp) => {
        res.status(resp.status).send(JSON.stringify(resp.data, null, 4));
    }).catch((err) => {
        res.status(404).json({message: "Something went wrong!"})
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    new Promise((resolve, reject) => {
        setTimeout(() => {
            let title = req.params.title;
            let bookList = {};
            if(title){
                for(let isbn in books){
                    if(books[isbn].title == title){
                        bookList[isbn] = books[isbn];
                    }
                };
                resolve({status: 200, data: bookList});
            }
            resolve({status: 403, data: "No title requested!"});
        },2000);
    }).then((resp) => {
        res.status(resp.status).send(JSON.stringify(resp.data, null, 4));
    }).catch((err) => {
        res.status(404).json({message: "Something went wrong!"})
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    let isbn = req.params.isbn;
    if(isbn){
        if(books[isbn]){
            let reviews = books[isbn].reviews;
            return res.send(JSON.stringify(reviews, null, 4));
        }
        return res.status(404).json({message: "Book not found!"});
    }
    return res.status(403).json({message: "No ID requested!"});
});

module.exports.general = public_users;
