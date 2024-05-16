const mongoose = require("mongoose");
var nodemailer = require('nodemailer');
const {pusher} = require("../app")
const dotenv = require('dotenv');
dotenv.config();

const ReportSchema = new mongoose.Schema({

    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: [true, "Please Provide Order Id!"],
    },


    report: {
        type: String,
        required: [true, "You Must Provide report Message"],
        trim: true,
        unique: true
    }


} , {timestamps:true});

ReportSchema.pre("save", function () {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_PASS,
        },

    });

    var mailOptions = {
        from: process.env.GMAIL,
        to: process.env.GMAIL,
        subject: 'SOMEONE MAKE A REPORT PLEASE CHECK IT OUT',
        html: `<p>ORDER ID: </p><h1>${this.order}</h1>, <p>REPORT CONTENT: </p><h1>${this.report}</h1>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('');
        }
    });
})



module.exports = mongoose.model("Report", ReportSchema);