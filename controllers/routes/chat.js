const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const passport = require('passport');
require('../../config/passport')(passport);
const Chat = require('../models/Chat');

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

/*GET ALL CHATS*/

router.get('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {
  let token = getToken(req.headers);

  if (token) {
    Chat.find(function (err, products) {
      if (err) return next(err);
      res.json(products);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/* GET SINGLE CHAT BY ID */

router.get('/:id', function (req, res, next) {
  Chat.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* SAVE CHAT */

router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {

  let token = getToken(req.headers);

  if (token) {
    Chat.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
});

/* UPDATE CHAT */

router.put('/:id', function (req, res, next) {
  Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* DELETE CHAT */

router.delete('/:id', function (req, res, next) {
  Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

//socket io port
server.listen(5005);

io.on('connection', function (socket) {

  socket.on('disconnect', function () {
    console.log('User disconnected');
  });

  socket.on('save-message', function (data) {
    io.emit('new-message', {message: data});
  });

  socket.on('typing', (data) => {
    console.log('start')
    socket.broadcast.emit('typing', (data));
  });

  socket.on('stopTyping', () => {
    console.log('stop')
    socket.broadcast.emit('stopTyping');
  });

});

module.exports = router;
