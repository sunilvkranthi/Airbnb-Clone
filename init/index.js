const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then((res)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async ()=>{
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj,owner:'668d185b8d2110574b522944'}))
   await Listing.insertMany(initdata.data);

}

initDB();