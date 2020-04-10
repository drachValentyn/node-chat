const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../../config/settings');
require('../../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/User");

router.post('/', function (req, res) {
  let result = []
  User.find({}, (err, docs) => {
    // mongoose.disconnect();

    if (docs && docs.length === 0) {
      return res.status(200).send({ respType: 'empty', message: 'Users not found' });
    }

    if (err) {
      return console.error('error', err);
    }

    docs.forEach((item) => {
      if(req.body.username !== item.username) {
        result.push(item);
      }
    })

    res.status(200).send(result);
  })
});

router.post('/:id', function (req, res) {
  const user = User.findOne({_id: req.params.userId});

  res.status(200).send(user);
});

module.exports = router;
