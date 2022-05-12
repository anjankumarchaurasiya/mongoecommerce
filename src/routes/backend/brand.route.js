const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');
const path = require('path');
const fs = require('fs');
const {
    viewBrandList
} = require('../../controllers/admin/brand.controller');
const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../../controllers/adminauth.controller');

// brand list
router.get('/',[ensureAuthenticated,isAdmin],trimRequest.all,viewBrandList);

module.exports = {router};