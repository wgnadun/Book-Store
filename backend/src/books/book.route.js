const express = require('express');
const router = express.Router();
const book = require('./book.model');


router.post("/create-book",async(req,res)=>{
    try{
        const newbook = await book({...req.body})
        await newbook.save()
        res.status(200).send({message:"Book created successfully",book: newbook})
    }    catch(err){
        console.error("Error in creating book",err)
        res.status(500).send({message:"failed to create book"})
    }

})



module.exports = router;