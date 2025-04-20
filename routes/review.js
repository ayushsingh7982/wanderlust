const express = require("express");
const router = express.Router();
const {reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    // console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Reviews
//Post route
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New review saved ");
    //  res.send("New review saved");

    res.redirect(`/listing/${listing._id}`);

}));

// Review Deletion Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });


    res.redirect(`/listing/${id}`)
}));

module.exports = router;