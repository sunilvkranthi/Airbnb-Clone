const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.user._id)){
     req.flash("error","You are not the owner of this listing");
     return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.user._id)){
     req.flash("error","You are not the author of this review");
     return res.redirect(`/listings/${id}`);
    }
    next();
}

/////////validating server side schema////////////
module.exports.validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    // let errMsg = "Invalid Data"
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

/////validating review////////
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    // let errMsg = "Invalid Data";
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};