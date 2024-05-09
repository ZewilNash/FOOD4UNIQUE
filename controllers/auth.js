const User = require("../modals/User");
const bcrypt = require("bcryptjs");
const Cart = require("../modals/Cart");
const Order = require("../modals/Order");
const Report = require("../modals/Report");


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

   

    res.status(200).json({success:true,cart:cart})
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

const sendReport = async (req,res) => {
    const {orderId,report} = req.body;

    

    const order = await Order.find({_id:orderId});

    

    if(order.length === 0){
        return res.status(404).json({msg:"Order Not Found" , success:false});
    }

    // create report
    const report_obj = await Report.create({
        order:orderId,
        report:report
    });

    res.status(200).json({success:true , msg:"Report Sent Successfully,W'll Contact You Soon.." , report_obj})
}

const getAllOrders = async (req,res) => {
    const orders = await Order.find({})

    res.status(200).json({orders,success:true});
}

const getOrder = async (req,res) => {
    const {id} = req.params;

    const order = await Order.find({_id:id});

    if(order.lenght === 0){
        return res.status(404).json({msg:"Order Not Found" , success:false});
    }

    res.status(200).json({order,success:true});
}


const editOrder = async (req,res) => {
    const {id} = req.params;
    const {status , isPaid} = req.body;

    const order = await Order.find({_id:id});
    
    if(order.lenght === 0){
        return res.status(404).json({msg:"Order Not Found" , success:false});
    }

    await Order.findOneAndUpdate({_id:id} , {status:status , isPaid:isPaid} , {useFindAndModify:false});

    res.status(200).json({msg:"Order Updated Successfully" , success:true})

}

const deleteOrder = async (req,res) => {
    const {id} = req.params;
    const order = await Order.find({_id:id});
    
    if(order.lenght === 0){
        return res.status(404).json({msg:"Order Not Found" , success:false});
    }

    await Order.findOneAndDelete({_id:id} , {useFindAndModify:false});

    res.status(200).json({msg:"Order Deleted Successfully" , success:true})

}       

module.exports = {
    signup,
    login,
    getUserCartLength,
    deleteFromCart,
    updateCartQty,
    makeOrder,
    getCart,
    deleteCart,
    sendReport,
    getAllOrders,
    getOrder,
    editOrder,
    deleteOrder
}