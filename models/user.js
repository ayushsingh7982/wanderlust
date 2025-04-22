const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Fixed typo

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true  // Added unique to prevent duplicate emails
    }
});

// Add the plugin to the schema (not to User, which doesn't exist yet)
userSchema.plugin(passportLocalMongoose, {
    // Optional configuration options would go here
    // usernameField: 'email' // if you want email as username
});

// Now create and export the model
module.exports = mongoose.model('User', userSchema);