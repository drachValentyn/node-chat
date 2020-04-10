const express = require('express');
const fs = require('fs');
const router = express.Router();
const passport = require('passport');
require('../../config/passport')(passport);
const Image = require('../models/File');
const upload = require('../../multer/storage');

const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.get('/', passport.authenticate('jwt', { session: false}),
  (req, res) => {
    let token = getToken(req.headers);
    if (token) {
      Image.find({
          user: req.query.user
        },
        function (err, images) {
          if (err) return next(err);
          res.json(images);
        });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

router.post('/', passport.authenticate('jwt', { session: false}),
  (req, res) => {
  let token = getToken(req.headers);
    if (token) {
      upload(req, res, function (err) {
      if(req.file === null || req.file === undefined || req.file === ""){
        res.json('No Image Set');
      } else {
        if (err){
          console.log(err);
        }else{
          let image = new Image();
          image.image = req.file.originalname;
          image.user = req.query.user;
          image.save(()=>{
            if (err) return next(err);
            res.json(image.image);
          });
        }
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


module.exports = router;
