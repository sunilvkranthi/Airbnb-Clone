const express  = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.postSignup));

router.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash: true}),userController.postLogin);

router.get("/logout",userController.logout);

module.exports = router;
