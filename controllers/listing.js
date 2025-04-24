const Listing=require("../models/listing");
const{listingSchema}= require("../schema");
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");



module.exports.index=async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
 }

 module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing=async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listing");
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(404, "Enter Valid Data for list")
    }
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted")
    res.redirect("/listing");
}

