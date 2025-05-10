const express = require('express');
const {createAOrder, getOrderByEmail} = require('./order.controller');



const router = express.Router();


///create order endpoints

//// create a new order
router.post('/',createAOrder);


// get orders by user email address

router.get('/email/:email',getOrderByEmail)

module.exports = router;