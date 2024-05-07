const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    cart: [],

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please Provide Order Owner To Add!"],
    },

    name: {
        type: String,
        required: [true, "You Must Provide name"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "You Must Provide email"],
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ]
    },

    phone: {
        type: String,
        required: [true, "You Must Provide Phone Number"],
        trim: true,
        unique: true
    },

    address: {
        type: String,
        required: [true, "You Must Provide Address"],
        trim: true,
    },
    state: {
        type: String,
        required: [true, "You Must Provide State"],
        trim: true,
    },
    country: {
        type: String,
        required: [true, "You Must Provide Country"],
        trim: true,
    },

    zip_code: {
        type: String,
        required: [true, "You Must Provide Country"],
        trim: true
    },
    road: {
        type: String
    },
    village: {
        type: String
    },

    leisure:{
        type: String
    },

    status:{
        type: String,
        required: [true, "You Must Provide Status"],
        trim: true,
        enum:["pending" , "delivered" , "canceled"],
        default:"pending"
    },

    isPaid:{
        type: Boolean,
        required: [true, "You Must Provide IsPaid"],
        trim: true,
    }


});



module.exports = mongoose.model("Order", OrderSchema);