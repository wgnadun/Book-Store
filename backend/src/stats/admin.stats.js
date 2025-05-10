const mongoose = require ('mongoose');
const express = require('express');
const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const { format } = require('path');
const router = express.Router();


// create a function to calculate admin stats

router.get("/",async (req,res)=>{
    try {
        // Total number of orders
        const totalNumOfOrders = await Order.countDocuments();

        // Total sales (sum of all totalPrice from orders)
        const totaleSales = await Order.aggregate([
            {
                $group:{
                    _id:null,
                    totaleSales:{$sum:"$totalPrice"},
                }
            }
        ]);
        //  Trending books statistics :
        const trendingBooksCount = await Book.aggregate([
            {$match:{trending:true}}, //Match only trending books
            {$count:"trendingBooksCount"} // return trending book count
        ]);
// if you want just the count as a number , you can extract it like this
        const trendingBooks = trendingBooksCount.length > 0 ?trendingBooksCount[0].
        trendingBooksCount : 0 ;

// totla number of books
        const totalBooks = await Book.countDocuments();
        
// Monthly sales (total sales for each month)

        const monthlySales = await Order.aggregate([
            {
                $group:{
                    _id:{ $dateToString:{format:"%Y-5%m",date:"$createdAt"}},// group by year and month
                    totaleSales:{ $sum : "$totalPrice"},
                    totalOrders:{$sum:1}// count total orders for each month
                }
            },{
                $sort:{_id:1}
            }
        ]);

        // summery of the whole result

        res.status(200).json({totalOrders,
            totaleSales:totaleSales[0]?.totaleSales || 0,
            trendingBooks,
            totalBooks,
            monthlySales,
        });

    } catch (error) {
        console.error("Error fetching admin stats:",error);
        req.status(500).json({message:"Failed to fetch admin stats"})
    }
})

module.exports= router;