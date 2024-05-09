const express = require("express");

const router = express.Router();

const authenticatedRoute = require("../middleware/auth");
const isAdminRoute = require("../middleware/isAdmin");
 
const {signup , login , getUserCartLength,deleteFromCart,updateCartQty,makeOrder,getCart,deleteCart,sendReport,getAllOrders,getOrder,editOrder,deleteOrder} = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);


router.route("/cart/:id").get(authenticatedRoute,getUserCartLength);
router.route("/report_us").post(authenticatedRoute,sendReport);

router.route("/get_orders").get(authenticatedRoute,isAdminRoute,getAllOrders);

router.route("/get_order/:id").get(authenticatedRoute,isAdminRoute,getOrder);

router.route("/edit_order/:id").patch(authenticatedRoute,isAdminRoute,editOrder);

router.route("/delete_order/:id").delete(authenticatedRoute,isAdminRoute,deleteOrder);


router.route("/order").post(authenticatedRoute,makeOrder);

router.route("/get_cart/:id").get(authenticatedRoute,getCart);

router.route("/delete_cart/:id").delete(authenticatedRoute,deleteCart);

router.route("/cart/remove/:userId/:foodId").delete(authenticatedRoute,deleteFromCart);

router.route("/cart/update_qty/:userId/:foodId").patch(authenticatedRoute,updateCartQty);


module.exports = router;