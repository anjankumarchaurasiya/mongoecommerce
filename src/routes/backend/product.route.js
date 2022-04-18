const express = require('express');
const router = express.Router();
const {viewProductList,addProductForm,createProduct,changeStatus} = require('../../controllers/admin/product.controller');
const trimRequest = require('trim-request');
const multer =require('multer');
const path = require('path');
const fs = require('fs');

const csrf = require('csurf')
const csrfProtection = csrf();
const bodyParser = require('body-parser')
const parseForm = bodyParser.urlencoded({ extended: false });

 // Setting the storage engine.
 const { multerConfig } = require('../../helpers/multer.helper');
 var upload = multerConfig(multer);
const { 
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl } = require('../../controllers/adminauth.controller');

// category list
router.get('/',[ensureAuthenticated,isAdmin],trimRequest.all,viewProductList);
// add category form
router.get('/add',[ensureAuthenticated,isAdmin],trimRequest.all,addProductForm);
// add category
router.post('/add',[ensureAuthenticated,isAdmin],trimRequest.all,upload.array('image'),createProduct);
//change status
router.get('/status/:id',[ensureAuthenticated,isAdmin],trimRequest.all,changeStatus)

module.exports = router;