const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://www.pixelstalk.net/wp-content/uploads/2016/06/HD-images-of-nature-download.jpg",
            set: (v) => v === "" ? "https://www.pixelstalk.net/wp-content/uploads/2016/06/HD-images-of-nature-download.jpg" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const listing = mongoose.model("Listing", listingSchema);
module.exports = listing;