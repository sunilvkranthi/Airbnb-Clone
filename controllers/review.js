const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.newReview = async (req,res)=>{
     
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("review saved");
    req.flash("success","Review Added")
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);

};