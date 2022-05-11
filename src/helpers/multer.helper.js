 
const multer =require('multer');
const path = require('path');
const moment = require('moment');
const slugify = require('slugify');
const mkdirp = require('mkdirp');
const fs = require('fs');

const categoryStorage = (multer) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(global.BACKEND_FOLDER, process.env.CATEGORY_STORAGE))
        },
        filename: function(req, file, cb) {
            const category = slugify(req.body.name) || 'temp'
            const saveTo = category + '-' + Date.now() + path.extname(file.originalname);
            cb(null, saveTo);
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
const productStorage = (multer) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(global.BACKEND_FOLDER, process.env.PRODUCT_STORAGE))
        },
        filename: function(req, file, cb) {
            const category = slugify(req.body.name) || 'temp'
            const saveTo = category + '-' + Date.now() + path.extname(file.originalname);
            cb(null, saveTo);
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
module.exports = {categoryStorage,productStorage}


