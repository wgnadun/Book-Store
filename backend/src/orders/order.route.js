const express = require('express');
const {createAOrder} = require('./order.controller');



const router =express.Router();


///create order endpoints

//// create a new order
router.post('/',createAOrder);




module.exports = router;