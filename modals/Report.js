const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({

    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: [true, "Please Provide Order Id!"],
    },


    report:{
        type: String,
        required: [true, "You Must Provide report Message"],
        trim: true,
        unique:true
    }


});



module.exports = mongoose.model("Report", ReportSchema);