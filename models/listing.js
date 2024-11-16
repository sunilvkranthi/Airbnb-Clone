const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { ref } = require("joi");

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,    
    },
    img:{
       url:String,
       filename: String,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        requried:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Review",
        },
    ],
    owner:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
    },
    
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    }
});

listingSchema.post("findOneAndDelete",async (list)=>{
    if(list.reviews.length){
        await Review.deleteMany({_id:{$in:list.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;
