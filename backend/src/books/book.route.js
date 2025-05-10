const express = require('express');
const router = express.Router();
const { postABook,getAllBooks,getSingleBook,updateBook,deleteBook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// post a book
router.post("/create-book",verifyAdminToken,postABook)

// get all books
router.get("/",getAllBooks)

// get single  book
router.get("/:id",getSingleBook)

// update a single  book
router.put("/edit/:id",verifyAdminToken,updateBook)

// delete a single  book
router.delete("/:id",verifyAdminToken,deleteBook)

module.exports = router;