const express = require('express');
const User = require('./user.model');

const router = express.Router();

router.post('/admin',async (req,res)=>{
    const {username,password} = req.body;
    try {
        const admin = await User.findOne({username})
    } catch (error) {
        console.error("Failed to login as admin",error)
        res.status(401).send({message:"Failed to login as admin"})
    }
})

module.exports = router;