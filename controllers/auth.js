const User = require("../modals/User");
const bcrypt = require("bcryptjs");
const Cart = require("../modals/Cart");
const Order = require("../modals/Order");


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


const getUserCartLength = async (req,res) => {
    const {id} = req.params;

    const user = await User.findOne({_id:id});

    if(!user){
        return res.status(404).json({msg:"User Not Found" , success:false});
    }

    const cart = await Cart.find({user:user._id});

    res.status(200).json({cartLength:cart.length});
}

const deleteFromCart = async (req,res) => {
    const {userId , foodId} = req.params;

    const user = await User.findOne({_id:userId});

    if(!user){
        return res.status(404).json({msg:"User Not Found" , success:false});
    }

    const findCart = await Cart.find({user:user._id , food:foodId});

    if(findCart.length === 0){
        return res.status(404).json({msg:"Food Not Found" , success:false});
    }

    await Cart.findOneAndDelete({user:user._id , food:foodId} , {useFindAndModify:false});

    res.status(200).json({msg:"Item Removed Successfully" , success:true})
}

const updateCartQty = async (req,res) => {
    const {userId , foodId} = req.params;

    const user = await User.findOne({_id:userId});

    if(!user){
        return res.status(404).json({msg:"User Not Found" , success:false});
    }

    const findCart = await Cart.find({user:user._id , food:foodId});

    if(findCart.length === 0){
        return res.status(404).json({msg:"Food Not Found" , success:false});
    }

    await Cart.findOneAndUpdate({user:user._id , food:foodId} , {qty:Number(req.body.qty)} , {useFindAndModify:false});

    res.status(200).json({msg:"Item Quantity Updated Successfully" , success:true})
}


const makeOrder = async (req,res) => {
    const order = await Order.create({...req.body});

    res.status(200).json({success:true , msg:"Your Order Has Been Made!" , order});
}

const getCart = async (req,res) => {
    const {id} = req.params;

    const user = await User.findOne({_id:id});

    if(!user){
        return res.status(404).json({msg:"User Not Found" , success:false});
    }

    const cart = await Cart.find({user:user._id}).populate("food");

    res.status(200).json({success:true,cart})
}

const deleteCart = async (req,res) => {
    const {id} = req.params;

    const user = await User.findOne({_id:id});

    if(!user){
        return res.status(404).json({msg:"User Not Found" , success:false});
    }

    const deleted_cart = await Cart.deleteMany({user:user._id});

    res.status(200).json({success:true,msg:"Deleted Cart Successfully" , deleted_cart})
}

module.exports = {
    signup,
    login,
    getUserCartLength,
    deleteFromCart,
    updateCartQty,
    makeOrder,
    getCart,
    deleteCart
}