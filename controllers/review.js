const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("New review saved ");
    //  res.send("New review saved");

    req.flash("success","New review created!")

    res.redirect(`/listing/${listing._id}`);
}


module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`)
}