const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    // Check if user already exists
    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    // Register user
    users.push({ username, password });
    return res.status(200).json({
        message: "User successfully registered"
    });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    //Write your code here
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) {
    //Write your code here
    const author = req.params.author;
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) {
    //Write your code here
    const title = req.params.title;
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
      );
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

module.exports.general = public_users;
