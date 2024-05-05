const express = require("express");

const router = express.Router();

const authenticatedRoute = require("../middleware/auth");

const isAdminMiddleWare = require("../middleware/isAdmin");

const {createProduct,addToFavourite,removeFromFav} = require("../controllers/product");

router.route("/").post(authenticatedRoute , isAdminMiddleWare , createProduct);

router.route("/addToFav/:foodId/:userId").patch(authenticatedRoute, addToFavourite);

router.route("/removeFromFav/:foodId/:userId").patch(authenticatedRoute, removeFromFav);



module.exports = router;