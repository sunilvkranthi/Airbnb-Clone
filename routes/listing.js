const express  = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateListing,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

////// INDEX ROUTE && CREATE ROUTE ///////
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.postListing));

////NEW ROUTE//////
router.get("/new",isLoggedIn,listingController.renderNewForm)

///// SHOW ROUTE / UPDATE ROUTE / DELETE ROUTE//////////////
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

/////EDIT ROUTE////////
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

module.exports = router;
