const Product = require("../modals/Product");

const User = require("../modals/User");


const createProduct = async (req,res) => {
    const {name,price,category,size,description,images} = req.body;

    if(images.length === 0){
        return res.status(400).json({success:false, msg:"Please Provide Images before inserting any of the fields"});
    }

    const product = await Product.create({name , price , category , size , description , images});

    res.status(201).json({product , success:true, msg:"Product Created Successfully"});
}


const addToFavourite = async (req,res) => {
    const {foodId,userId} = req.params;

    let user_fav

    const user = await User.findOne({_id:userId});

    
    
    if(!user){
        return res.status(404).json({msg:"No User Found!" , success:false})
    }

    

    let matchArr = user_fav ? user_fav.favourites.filter(id => String(id) === String(foodId)) : user.favourites.filter(id => String(id) === String(foodId));

    if(matchArr.length === 1){
        return res.status(400).json({msg:"You Already Added This To Favourite!" , success:false})
    }




  user_fav =  await User.findOneAndUpdate(
        { _id: user._id }, 
        { $push: { favourites: foodId } },{useFindAndModify: false}
        
    );

    
    

    res.status(200).json({msg:"Item Added To Favourite!" , success:true})

}

const removeFromFav = async (req,res) => {
    const {foodId,userId} = req.params;

    

    const user = await User.findOne({_id:userId});

    
    
    
    if(!user){
        return res.status(404).json({msg:"No User Found!" , success:false})
    }

    

    const updatedFavourites = user.favourites.filter(id => String(id) !== String(foodId));


     user_fav =  await User.findOneAndUpdate(
        { _id: user._id }, 
        { favourites: updatedFavourites},
        {useFindAndModify: false}
        
    );
    

    res.status(200).json({msg:"Item Removed From Favourite!" , success:true})

}

module.exports = {
    createProduct,
    addToFavourite,
    removeFromFav
}