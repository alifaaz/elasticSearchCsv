const multer =require("multer");


const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        
        callback(null, `./csv/`);

    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});



module.exports = multer({
    storage: Storage
}).single("file"); //Field name and max count



