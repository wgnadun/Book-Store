const express = require('express');
const router = express.Router();
const book = require('./book.model');
const { postABook,getAllBooks } = require('./book.controller');

// post a book
router.post("/create-book",postABook)

// get all books
router.get("/",getAllBooks)

module.exports = router;