const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// to attach backend with cloudinary account we are config it with .env credintials
cloudinary.config({ 
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
});

// this is from npm cloudinary, only provide the folder name
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};  // we are using this in routes listing