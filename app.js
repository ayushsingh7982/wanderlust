const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");

// Utils and Models


// Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

// Database Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
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

const sessionOptions={
  secret: "mysupersecretcode",
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
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

// Route Mounting (using singular 'listing' consistently)
app.use("/listing", listingRoutes);
app.use("/listing/:id/reviews", reviewRoutes);

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