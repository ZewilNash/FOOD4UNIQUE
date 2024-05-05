const User = require("../modals/User");
const bcrypt = require("bcryptjs");

const signup = async (req,res) => {

    const {fullname , email , password} = req.body;

    const user = await User.create({fullname , email, password});

  
    const token = await user.createToken();

    res.status(201).json({user:{_id:user._id , fullname:user.fullname , email:user.email,role:user.role}, token , msg:"User Created Successfully" , success:true});
}


const login = async (req,res) => {

    if(!req.body.email || !req.body.password){
        return res.status(400).json({msg:"Please provide email and password",success:false});
    }

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return res.status(400).json({msg:"Invalid Credentials" , success:false});
    }

    const isMatch = await user.comparePasswords(req.body.password);

    if(!isMatch){
        return res.status(400).json({msg:"Invalid Credentials" , success:false});
    }

    const token = await user.createToken();

    res.status(200).json({user:{_id:user._id , fullname:user.fullname ,     email:user.email,role:user.role}, token ,  msg:"User Logged In Successfully" , success:true});
}


module.exports = {
    signup,
    login
}