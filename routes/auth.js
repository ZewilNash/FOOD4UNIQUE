const express = require("express");

const router = express.Router();

const authenticatedRoute = require("../middleware/auth");
 
const {signup , login , getUserCartLength,deleteFromCart,updateCartQty,makeOrder,getCart,deleteCart} = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);


router.route("/cart/:id").get(authenticatedRoute,getUserCartLength);

router.route("/order").post(authenticatedRoute,makeOrder);

router.route("/get_cart/:id").get(authenticatedRoute,getCart);

router.route("/delete_cart/:id").delete(authenticatedRoute,deleteCart);

router.route("/cart/remove/:userId/:foodId").delete(authenticatedRoute,deleteFromCart);

router.route("/cart/update_qty/:userId/:foodId").patch(authenticatedRoute,updateCartQty);


module.exports = router;