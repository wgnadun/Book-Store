const Book = require("./book.model")


// post a book controller func

const postABook =async(req,res)=>{
    try{
        const newbook = await Book({...req.body})
        await newbook.save()
        res.status(200).send({message:"Book created successfully",book: newbook})
    }    catch(err){
        console.error("Error in creating book",err)
        res.status(500).send({message:"failed to create book"})
    }

}
// get all books controller func
 
 const getAllBooks = async(req,res)=>{
    try{
        const books = await Book.find()
        res.status(200).send({books})
    }catch(err){
        console.error("Error in fetching books",err)
        res.status(500).send({message:"failed to fetch books"})
    }
 }
module.exports={
    postABook,
    getAllBooks
}
