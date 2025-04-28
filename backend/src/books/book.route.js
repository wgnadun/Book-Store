const express = require('express');
const router = express.Router();
const book = require('./book.model');
const { postABook,getAllBooks,getSingleBook,updateBook } = require('./book.controller');

// post a book
router.post("/create-book",postABook)

// get all books
router.get("/",getAllBooks)

// get single  book
router.get("/:id",getSingleBook)

// update a single  book
router.get("/edit/:id",updateBook)

module.exports = router;