if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

// Utils and Models


// Routes 
const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter=require("./routes/user.js");

// Database Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}

main().catch(err => console.log(err));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Replace your current connection code with this:
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,  // 5 second timeout
      socketTimeoutMS: 45000,         // 45 second socket timeout
      connectTimeoutMS: 10000         // 10 second connection timeout
    });

    console.log("Connected to MongoDB Atlas");
    
    // Only create session store after successful connection
    const store = MongoStore.create({
      client: mongoose.connection.getClient(), // Reuse existing connection
      crypto: {
        secret: process.env.SESSION_SECRET
      },
      touchAfter: 24 * 3600
    });
    
    return store;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

const sessionOptions={
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//three days from now
    maxAge:1000*60*60*24*3,
    httpOnly:true
  }
};



// Root Route
app.get("/", (req, res) => {
  res.redirect("/listing")
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));  // Serve the privacy.html file
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));  // Serve the terms.html file
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})



// Route Mounting (using singular 'listing' consistently)
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/",userRouter);

// 404 Handler
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server Start
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});