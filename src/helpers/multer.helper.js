 
const multer =require('multer');
const path = require('path');
const fs = require('fs');
 exports.multerConfig = (multer) => {
    
    const storage = multer.diskStorage({
        destination: '/assets/category/',
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    const fileFilter = (req, file, cb) => {
        (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') 
        ? cb(null, true) 
        : cb(null, false)
    };

    return multer({
        storage: storage,
        limits: { fileSize: 1048576 },
        fileFilter: fileFilter
    });
};



