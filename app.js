// unshift function add upfront element to array

require("express-async-errors");
require("dotenv").config()
const { readFileSync } = require("fs");
const {createServer} = require("http")
const User = require("./modals/User");
const Cart = require("./modals/Cart");
const Order = require("./modals/Order");
const BOOKOrder = require("./modals/BookedOrder");
const Report = require("./modals/Report");

// const Pusher = require("pusher");

// global.pusher = new Pusher({
//     appId: "1803313",
//     key: "17c9f46a0256c402a5c8",
//     secret: "2a64cd67e60cbce7c8de",
//     cluster: "eu",
//     useTLS: true
// });




const Product = require("./modals/Product");

const authRouter = require("./routes/auth");
const { Server } = require('socket.io');
const productRouter = require("./routes/product");

//security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit');



const express = require("express");
const app = express();

const server = createServer(app);

const io = new Server(server);
global.io = io;

const cors = require("cors");

const errorhandlerMiddleware = require("./middleware/errorHandler");

const authenticatedRoute = require("./middleware/auth");

const isAdminMiddleWare = require("./middleware/isAdmin");

const bodyParser = require("body-parser")



const connectDB = require("./db/connection");



const PORT = process.env.PORT || 3000


app.use(express.json());
app.use(bodyParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.set("trust proxy", 1);

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    })
);

// hemlet prevents the other urls to load in our page for security reasons

// we will modify hemlet to accept only https to load scripts in our page

// app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https: data:"],
            "script-src": ["'self'", "https: data:"],
            "default-src": ["'self'", "https: data:"],
            
        }
    })
)

app.use(xss());

app.use(cors());


// MAIN APP ROUTES

app.get("/", (req, res) => {
    res.render("pages/landing/index");
});

// app.get("/sw.js", (req, res) => {
//     res.render("pages/sw.js/index");
// });

app.get("/signuppage", (req, res) => {
    res.render("pages/signuppage/index");
});

app.get("/loginpage", (req, res) => {
    res.render("pages/loginpage/index");
});

app.get("/home", (req, res) => {
    res.render("pages/home/index");
});

app.get("/food", async (req, res) => {

    const products = await Product.find({}).sort("createdAt");

    res.render("pages/food/index", { product: [], products: products });
});

app.get("/cart/:id", async (req, res) => {

    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        res.status(404);
        return res.redirect("/notfound");
    }

    const products = await Cart.find({ user: req.params.id }).populate("food").sort("createdAt");

  
    // const total = products.reduce((a,b) => a.food.price * b.food.price)

    // console.log(total);

    if (products.length > 0) {

        const array = [];

        for (let i = 0; i < products.length; i++) {
            let mult = Number(products[i].food.price) * Number(products[i].qty);
            array.push(mult);
        }

        const total = array.reduce((a, b) => a + b);

        return res.render("pages/cart/index", { products: products, user_id: user._id, total: total });

    }



res.render("pages/cart/index", { products: [], user_id: user._id, total: 0 });


    
});

app.get("/findfood/:text", async (req, res) => {

    const { text } = req.params

    let products = await Product.find({ name: { $regex: text, $options: "i" } }).sort("createdAt");


    if (products.length === 0) {

        return res.render("pages/findfood/index", { msg: "NO RESULT FOUND MATCHING YOUR SEARCH", products: [] });
    }

    res.render("pages/findfood/index", { products: products, msg: "" });
});

app.get("/food/:cat", async (req, res) => {

    const { cat } = req.params;

    const product = await Product.find({ category: cat }).sort("createdAt");



    if (product.length === 0) {
        res.status(404);
        return res.redirect("/notfound");
    }

    res.render("pages/food/index", { product: product });
});

app.get("/fooddetail/:id", async (req, res) => {

    const { id } = req.params;

    const food = await Product.findOne({ _id: id });

    if (!food) {
        res.status(404);
        return res.redirect("/notfound");
    }

    let may_like = await Product.find({ category: food.category, _id: { $ne: food._id } });


    res.render("pages/fooddetail/index", { food: food, alsoLike: may_like });
});

app.get("/aboutus", (req, res) => {
    res.render("pages/aboutus/index");
});

app.get("/notfound", (req, res) => {
    res.render("pages/notfound/index");
});
app.get("/order_success/:id", async (req, res) => {
    const {id} = req.params;

    const order = await Order.findOne({_id:id});

    if(!order){
        return res.redirect("/notfound");
    }

    res.render("pages/order_success/index" , {id:id});
});

app.get("/book_order_success/:id", async (req, res) => {
    const {id} = req.params;

    const order = await BOOKOrder.findOne({_id:id});

    if(!order){
        return res.redirect("/notfound");
    }

    res.render("pages/book_order_success/index" , {order:order});
});


app.get("/favourites/:id", async (req, res) => {

    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate("favourites");

    if (!user) {
        return res.redirect("/notfound");
    }

    let user_favoutites = user.favourites;

    res.render("pages/favourites/index", { favourites: user_favoutites });
});

app.get("/contactus", (req, res) => {
    res.render("pages/contactus/index");
});

app.get("/user_orders/:id", async (req, res) => {

    const {id} = req.params;
    const user = await User.find({_id:id});

 
    
    if(user.lenght === 0){
        return res.status(404).json({msg:"user Not Found" , success:false});
    }

    const userOrders = await BOOKOrder.find({email:user[0].email}).sort("-createdAt");

    const carts = [];

    // console.log(userOrders);
    
     userOrders.forEach(order => {
         order.cart.forEach(c => {
             carts.push(c) 
         })
     })


     
     

     if(userOrders.length === 0){
       return res.render("pages/user_orders/index" , {msg:"You Have No Orders Yet To Track"});
     }

    res.render("pages/user_orders/index" , {userOrders,carts});
});



// ["pending" , "delivered" , "canceled"]
app.get("/4unique-admin", async (req, res) => {
    const orders = await Order.find({}).sort("-createdAt");

    const bookedOrder = await BOOKOrder.find({}).sort("-createdAt");

    const bookedOrders = await BOOKOrder.find({}).sort("-createdAt");

    const pendingOrders = await Order.find({status:"pending"});
    const deliveredOrders = await Order.find({status:"delivered"});
    const canceledOrders = await Order.find({status:"canceled"});

    const completedOrders = await BOOKOrder.find({status:"completed"}).sort("-createdAt");

    const ordersLength = orders.length;
    const bookedordersLength = bookedOrder.length;

    const reports = await Report.find({}).sort("-createdAt");

    const reportsLength = reports.length


    const carts = orders.map(order => order.cart);

    

    const cart_items = [];
    const foods = [];
    carts.forEach(c => {
        // console.log(c);
        cart_items.push(c);  
    })
    
    
    cart_items.forEach(c => {
        c.forEach(item => {
            foods.push(item.food);
        })
        
    });

  
    
    
    const products = await Product.find({}).sort("-createdAt");

    const users = await User.find({}).sort("-createdAt");;
    const usersLength = users.length

    const productsLength = products.length;

    // check passwords
    res.render("pages/4unique-admin/index", { products: products,ordersLength,productsLength,reportsLength , orders:orders,carts:carts,foods:foods,reports:reports,usersLength,users:users,canceledOrders,pendingOrders,deliveredOrders,bookedOrders:bookedOrders,completedOrders:completedOrders,bookedordersLength });
});

// app.get("/4unique-admin/:name" ,async (req,res) => {
//     const product = await Product.findOne({name:req.params.name});
//     // check passwords
//     res.render("pages/4unique-admin/index");
// });



// END MAIN APP ROUTES

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/products", productRouter);

app.all("*", (req, res) => {
    res.render("pages/notfound/index");
});


app.use(errorhandlerMiddleware);



const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        server.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`);
        })

    } catch (err) {
        console.log(err);
    }
}


start();

