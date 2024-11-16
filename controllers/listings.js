const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken:mapToken})

module.exports.index = async (req,res,next)=>{
    const allListings = await Listing.find({})
    
    res.render("index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("new.ejs");
};

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("failure","Lisiting you requested for is not available");
        res.redirect("/listings");
    }
        res.render("show.ejs",{list}); 
};

module.exports.postListing = async (req,res,next)=>{
     
    let response = await geocodingClient.forwardGeocode({
        query:req.body.location,
        limit:1
    })
    .send()
    
    let {title,description,price,location,country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    let list = new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
    });
    list.img = {url,filename};
    list.owner = req.user._id;
    list.geometry = response.body.features[0].geometry;
    await list.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");  
};

module.exports.editListing = async (req,res,next)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash("failure","Lisiting you requested for updating is not available");
        res.redirect("/listings");
    }
        let originalImageUrl = list.img.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300/w_250");
        res.render("edit.ejs",{list,originalImageUrl});  
};

module.exports.updateListing = async (req,res,next)=>{

    let {id} = req.params;
    let {title,description,price,location,country} = req.body;
    
    let list = await Listing.findByIdAndUpdate(id,{
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
    },{runValidators:true,new:true});
    
    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        list.img = {url,filename};
        await list.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Lisitng is Deleted")
    res.redirect("/listings");
};

