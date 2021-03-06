const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const user = require('../controllers/users');

router.route('/register')
    .get(user.newUserForm)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login)

router.get('/logout',user.logout)

module.exports = router;