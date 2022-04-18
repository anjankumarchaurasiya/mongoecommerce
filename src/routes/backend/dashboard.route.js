const express = require('express');
const router = express.Router();
const { 
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    readAccessControl,
    createAccessControl,
    updateAccessControl,
    deleteAccessControl } = require('../../controllers/adminauth.controller');

// index page
router.get('/',[ensureAuthenticated, isAdmin],  async (req, res) => {
  res.render('backend/dashboard/dashboard', 
  { 
    title: 'Admin dashboard',
    layout: 'layouts/backend'
  });
});

module.exports = router;