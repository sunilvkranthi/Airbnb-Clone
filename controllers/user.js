const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("signup.ejs");
};

module.exports.postSignup = async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Waderlust");
            res.redirect("/listings");
        })    
    }catch(err){
        req.flash("failure",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("login.ejs");
};

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome! back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};