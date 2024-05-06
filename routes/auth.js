const express = require("express");

const router = express.Router();

const authenticatedRoute = require("../middleware/auth");
 
const {signup , login , getUserCartLength,deleteFromCart,updateCartQty} = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);


router.route("/cart/:id").get(authenticatedRoute,getUserCartLength);

router.route("/cart/remove/:userId/:foodId").delete(authenticatedRoute,deleteFromCart);

router.route("/cart/update_qty/:userId/:foodId").patch(authenticatedRoute,updateCartQty);


module.exports = router;