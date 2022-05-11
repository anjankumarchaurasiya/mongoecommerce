const express = require('express');
const router = express.Router();
const {createCategory,addCategoryForm,viewCategoryList,deleteCategory} = require('../../controllers/admin/category.controller');
const trimRequest = require('trim-request');
const multer =require('multer');
const path = require('path');
const fs = require('fs');
 // Setting the storage engine.
const { categoryStorage } = require('../../helpers/multer.helper');
var categoryupload = categoryStorage(multer);
const { 
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl } = require('../../controllers/adminauth.controller');

// category list
router.get('/',[ensureAuthenticated,isAdmin],trimRequest.all,viewCategoryList);
// add category form
router.get('/add',[ensureAuthenticated,isAdmin],trimRequest.all,addCategoryForm);
// add category
router.post('/add',[ensureAuthenticated,isAdmin],trimRequest.all,categoryupload.single('image'),createCategory);
// delete category
router.get('/delete/:id',[ensureAuthenticated,isAdmin],trimRequest.all,deleteCategory);
module.exports = router;