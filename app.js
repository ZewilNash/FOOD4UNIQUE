// unshift function add upfront element to array

require("express-async-errors");
require("dotenv").config()
const { readFileSync } = require("fs");

const User = require("./modals/User");
const Cart = require("./modals/Cart");

const Product = require("./modals/Product");

const authRouter = require("./routes/auth");

const productRouter = require("./routes/product");

//security packages
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit');



const express = require("express");
const app = express();

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

    const products = await Product.find({});

    res.render("pages/food/index", { product: [], products: products });
});

app.get("/cart/:id", async (req, res) => {

    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        res.status(404);
        return res.render("pages/notfound/index");
    }

    const products = await Cart.find({ user: req.params.id }).populate("food");

  
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

    let products = await Product.find({ name: { $regex: text, $options: "i" } });


    if (products.length === 0) {

        return res.render("pages/findfood/index", { msg: "NO RESULT FOUND MATCHING YOUR SEARCH", products: [] });
    }

    res.render("pages/findfood/index", { products: products, msg: "" });
});

app.get("/food/:cat", async (req, res) => {

    const { cat } = req.params;

    const product = await Product.find({ category: cat });



    if (product.length === 0) {
        res.status(404);
        return res.render("pages/notfound/index");
    }

    res.render("pages/food/index", { product: product });
});

app.get("/fooddetail/:id", async (req, res) => {

    const { id } = req.params;

    const food = await Product.findOne({ _id: id });

    if (!food) {
        res.status(404);
        return res.render("pages/notfound/index");
    }

    let may_like = await Product.find({ category: food.category, _id: { $ne: food._id } });


    res.render("pages/fooddetail/index", { food: food, alsoLike: may_like });
});

app.get("/aboutus", (req, res) => {
    res.render("pages/aboutus/index");
});
app.get("/order_success/:id", (req, res) => {
    const {id} = req.params;
    res.render("pages/order_success/index" , {id:id});
});


app.get("/favourites/:id", async (req, res) => {

    const { id } = req.params;

    const user = await User.findOne({ _id: id }).populate("favourites");

    if (!user) {
        return res.render("pages/notfound/index");
    }

    let user_favoutites = user.favourites;

    res.render("pages/favourites/index", { favourites: user_favoutites });
});

app.get("/contactus", (req, res) => {
    res.render("pages/contactus/index");
});

app.get("/4unique-admin", async (req, res) => {
    const products = await Product.find({});
    // check passwords
    res.render("pages/4unique-admin/index", { products: products });
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
        app.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`);
        })

    } catch (err) {
        console.log(err);
    }
}


start();
