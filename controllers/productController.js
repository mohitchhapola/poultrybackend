const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//create product 

const createProduct = asyncHandler(async(req,res)=>{
    res.send('creating new product')
})



module.exports = {
    createProduct
}