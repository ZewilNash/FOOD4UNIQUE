const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "You Must Provide FullName"],
        trim: true
    },

    email: {
        type: String,
        required: [true, "You Must Provide Email"],
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ]
    },
    password: {
        type: String,
        required: [true, "You Must Provide Password"],
        trim: true,
        match: [
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/,

            'Please provide valid       password (one Capital      Letter One smaller     one special Character and one number) With length more than or equal 10'

        ]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    favourites:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Product"
        }
    ]

});


UserSchema.pre("save" , async function(next) {
    // hash password
    const salt = await bcrypt.genSalt(10);
    
    this.password = await bcrypt.hash(this.password , salt);

    next();
});

UserSchema.methods.createToken =  function () {
    return jwt.sign({id:this._id} , process.env.JWT_SECRET , {
        expiresIn:"30d"
    });
}



UserSchema.methods.comparePasswords = async function (userPassword) {

    const isEqual = await bcrypt.compare(userPassword , this.password);

    return isEqual

}


module.exports = mongoose.model("User", UserSchema);