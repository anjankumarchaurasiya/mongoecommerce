const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require('bcrypt');
const passport = require('passport');

const {
  User,
  validateUser,
  confirmPassword
} = require('../models/authuser.model');

const {
  ensureAuthenticated,
  isAdmin,
  isLoggedIn,
  readAccessControl,
  createAccessControl,
  updateAccessControl,
  deleteAccessControl
} = require('../controllers/adminauth.controller');


// index page
router.get('/', isLoggedIn, (req, res) => {
  res.render('login/index', {
      title: 'Admin login',
      layout: 'layouts/common'
  });
});
// POST Signin Route.
router.post('/signin', isLoggedIn, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    successFlash: true,
    failureRedirect: '/admin',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout',[ensureAuthenticated],(req,res)=>{
  req.logout();
   req.session.destroy(()=>{
    res.redirect('/admin');
  });
});
module.exports = router;