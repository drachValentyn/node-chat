const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../config/passport')(passport);
const Room = require('../models/Room');

getToken = function (headers) {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


/*GET ALL ROOMS*/

router.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  let token = getToken(req.headers);

  if (token) {
    Room.find(function (err, products) {
      if (err) return next(err);
      res.json(products);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/*GET SINGLE ROOM BY ID*/

router.get('/:id', function (req, res, next) {
  Room.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post)
  })
});

/*SAVE ROOM*/

router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  let token = getToken(req.headers);

  if (token) {
    Room.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post)
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/*DELETE ROOM*/

router.delete('/:id', function (req, res, next) {
  Room.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post)
  })
});


module.exports = router;
