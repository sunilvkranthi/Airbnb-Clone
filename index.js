if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");

const dbURL = process.env.ATLASDB_URL;

main()
.then((res)=>{
    console.log("Database Connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public/CSS")));
app.use(express.static(path.join(__dirname,"/public/JS")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


const store = mongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
});

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000,(req,res)=>{
    console.log("Connection Successful");
})

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.failureMsg = req.flash("failure");
    res.locals.errorMsg = req.flash("error");
    res.locals.user =  req.user;
    next();
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

////All other api endpoints/////////////
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PageNotFound!"));
});

///ERROR HANDLER////////
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"} = err;
    res.status(status).render("error.ejs",{message});
})
