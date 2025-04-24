//const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    listing: {  // THIS IS CRUCIAL
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});



module.exports=mongoose.model("Review",reviewSchema);