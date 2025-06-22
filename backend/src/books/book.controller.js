const Book = require("./book.model")

// post a book controller func
const postABook = async(req, res) => {
    try {
        const newbook = await Book({...req.body})
        await newbook.save()
        res.status(200).send({
            message: "Book created successfully", 
            book: newbook
        })
    } catch(error) {
        console.error("Error in creating book", error)
        res.status(500).send({
            message: "failed to create book",
            error: error.message
        })
    }
}

// get all books controller func
const getAllBooks = async(req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1})
        res.status(200).send({
            message: "Books fetched successfully",
            books: books,
            count: books.length
        })
    } catch(error) {
        console.error("Error in fetching books", error)
        res.status(500).send({
            message: "failed to fetch books",
            error: error.message
        })
    }
}

// get single book controller func
const getSingleBook = async(req, res) => {
    try {
        const {id} = req.params;
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                message: "Invalid book ID format"
            })
        }
        
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).send({
                message: "Book not found"
            })
        }
        
        res.status(200).send({
            message: "Book fetched successfully",
            book: book
        })
    } catch(error) {
        console.error("Error in fetching book", error)
        res.status(500).send({
            message: "failed to fetch book",
            error: error.message
        })
    }
}

// Update book controller func
const updateBook = async(req, res) => {
    try {
        const {id} = req.params;
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                message: "Invalid book ID format"
            })
        }
        
        const updatedbook = await Book.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!updatedbook) {
            return res.status(404).send({
                message: "Book not found"
            })
        }
        
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedbook
        })
    } catch(err) {
        console.error("Error in updating book", err)
        res.status(500).send({
            message: "failed to update book",
            error: err.message
        })
    }
}

// delete a book controller func
const deleteBook = async(req, res) => {
    try {
        const {id} = req.params;
        
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                message: "Invalid book ID format"
            })
        }
        
        const deletedBook = await Book.findByIdAndDelete(id);
        
        if (!deletedBook) {
            return res.status(404).send({
                message: "Book not found"
            })
        }
        
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch(error) {
        console.error("Error in deleting book", error)
        res.status(500).send({
            message: "failed to delete book",
            error: error.message
        })
    }
}

// Batch fetch books by IDs (for better performance when fetching multiple books)
const getBooksByIds = async(req, res) => {
    try {
        const {ids} = req.body;
        
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).send({
                message: "Please provide an array of book IDs"
            })
        }
        
        // Validate all IDs
        const invalidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
        if (invalidIds.length > 0) {
            return res.status(400).send({
                message: "Invalid book ID format",
                invalidIds: invalidIds
            })
        }
        
        const books = await Book.find({
            '_id': { $in: ids }
        }).sort({createdAt: -1});
        
        res.status(200).send({
            message: "Books fetched successfully",
            books: books,
            count: books.length,
            requestedCount: ids.length
        })
    } catch(error) {
        console.error("Error in batch fetching books", error)
        res.status(500).send({
            message: "failed to fetch books",
            error: error.message
        })
    }
}

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook,
    getBooksByIds
}