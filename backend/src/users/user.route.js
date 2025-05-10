const express = require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.post('/admin',async (req,res)=>{
    const {username,password} = req.body;
    try {
        const admin = await User.findOne({username})
        if(!admin){
            res.status(404).send({message:"Admin not found!"})
        }
        if(admin.password !== password){
            return res.status(401).send({message:'Invalid password'})
        }
     
        const token = jwt.sign(
            {id:admin._id,username:admin.username,role:admin.role}, // payload (data to be encoded)
            JWT_SECRET,         // secret key
            {expiresIn:'1h'} // token expires in 1 hour
        )

        return res.status(200).json({
            message :"Authentication successful",
            token: token,
            user : {
                username:admin.username,
                role:admin.role
            }
        })
    } catch (error) {
        console.error("Failed to login as admin",error)
        res.status(401).send({message:"Failed to login as admin"})
    }
})

module.exports = router;