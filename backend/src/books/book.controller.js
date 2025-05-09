const Book = require("./book.model")


// post a book controller func

const postABook =async(req,res)=>{
    try{
        const newbook = await Book({...req.body})
        await newbook.save()
        res.status(200).send({message:"Book created successfully",book: newbook})
    }    catch(error){
        console.error("Error in creating book",error)
        res.status(500).send({message:"failed to create book"})
    }

}
// get all books controller func
 
 const getAllBooks = async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1})
        res.status(200).send({books})
    }catch(error){
        console.error("Error in fetching books",error)
        res.status(500).send({message:"failed to fetch books"})
    }
 }
// get single book controller func
 
 const getSingleBook = async(req,res)=>{
    try{
        const {id} = req.params;
        const book = await Book.findById(id);
        if(!book){
            res.status(404).send({message:" oops ! Book is not found !"})
        }
        res.status(200).send({book})
    }catch(error){
        console.error("Error in fetching books",error)
        res.status(500).send({message:"failed to fetch a book"})
    }
 }
// Update  book controller func
 
 const updateBook = async(req,res)=>{
    try{
        const {id} = req.params;
        const updatedbook = await Book.findByIdAndUpdate(id,req.body, {new:true});
        if(!updatedbook){
            res.status(404).send({message:" oops ! Book is not found !"})
        }
        res.status(200).send({
            message:"Book updated successfully",
            book:updatedbook
        })
    }catch(err){
        console.error("Error in fetching books",err)
        res.status(500).send({message:"failed to fetch a book"})
    }
 }
 
//  delete a book controller finc
 
 const deleteBook = async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if(!deletedBook){
            res.status(404).send({message:" oops ! Book is not found !"})
        }
        res.status(200).send({
            message:"Book deleted successfully",
            book:deletedBook
        })
    }catch(error){
        console.error("Error in deleting books",error)
        res.status(500).send({message:"failed to delete book"})
    }
 }
module.exports={
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteBook
}
