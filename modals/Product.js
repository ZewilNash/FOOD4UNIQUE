const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "Provide a name for product"],
        trim:true,
        minlength:5,
        maxlength:50,
        unique:true
    },

    price:{
        type:Number,
        required:[true , "Provide a price for product"],
        trim:true
    },

    category:{
        type:String,
        required:[true , "Provide a category for product"],
        trim:true,
        minlength:5,
        maxlength:100
    },

    size:[

        {
            type:String,
            required:[true,"provide a size"],
            trim:true
        },
    ],

    description:{
        type:String,
        required:[true , "Provide a description for product"],
        trim:true,
        minlength:10
    },
    images:[

        {
            type:String,
            required:[true,"provide an image"],
            trim:true
        }
    ],

});



module.exports = mongoose.model("Product" , ProductSchema);