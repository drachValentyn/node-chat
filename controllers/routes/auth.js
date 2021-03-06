const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../../config/settings');
require('../../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");

router.post('/register', function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({success: false,
          msg: "Username already exists.",
          res: res,
          user: newUser});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/login', function (req, res) {
  console.log(req.body)

  User.findOne({
      username: req.body.username
    }, function (err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'})
      } else {
        //  check if password matches

        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            let userInfo = {
              loggedIn: true,
              userId: user._id,
              username: user.username
            };
            // if user is found and password is right create a token
            let token = jwt.sign(user.toJSON(), settings.secret);
            res.json({success: true, token: 'JWT ' + token, user: userInfo});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'})
          }
        })
      }
    }
  )
});

module.exports = router;
