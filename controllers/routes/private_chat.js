const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const passport = require('passport');
require('../../config/passport')(passport);
const PrivateChat = require('../models/PrivateChat');
const users = require('../Users')()

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

let namespace = io.of('');

/* GET SINGLE CHAT BY NAME */

router.get('/', function (req, res, next) {
  namespace = io.of('private-chats');

  PrivateChat.find(req.body.room_name, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* GET SINGLE CHAT BY ID */

router.get('/:id', function (req, res, next) {
  namespace = io.of('private-chats');
  PrivateChat.findById(req.params.name, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* SAVE CHAT */

router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {

  let token = getToken(req.headers);

  if (token) {
    console.log(req.body)
    PrivateChat.create(req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    })
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'})
  }
});

/* UPDATE CHAT */

router.put('/:id', function (req, res, next) {
  PrivateChat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* DELETE CHAT */

router.delete('/:id', function (req, res, next) {
  PrivateChat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});


const message = (name, text, id) => ({ name, text, id })

namespace.on('connection', socket => {

  socket.on('userJoined', (data, cb) => {
    if (!data.name || !data.room) {
      return cb('Data incorrect')
    }
    socket.join(data.room)

    users.remove(socket.id)

    users.add({
      id: socket.id,
      name: data.name,
      room: data.room
    })

    cb({ userId: socket.id })
    namespace.to(data.room).emit('updateUsers', users.getByRoom(data.room))
    socket.emit('newMessage', message('', `Welcome ${data.name}.`))
    socket.broadcast
      .to(data.room)
      .emit('newMessage', message('', `User ${data.name} logged in.`))
  })

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Текст не может быть пустым')
    }
    const user = users.get(data.id)
    if (user) {
      namespace.to(user.room).emit('newMessage', message(user.name, data.text, data.id))
    }
    cb()
  })

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id)
    if (user) {
      namespace.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      namespace.to(user.room).emit(
        'newMessage',
        message(' ', `User ${user.name} logged out.`)
      )
    }
    cb()
  })

  socket.on('disconnect', () => {
    namespace = namespace.of('');
    const user = users.remove(socket.id)
    if (user) {
      namespace.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      namespace.to(user.room).emit(
        'newMessage',
        message('admin', `User ${user.name} logged out.`)
      )
    }
  })

  socket.on('typing', (data) => {
    console.log('start')
    socket.broadcast.emit('typing', (data));
  });

  socket.on('stopTyping', () => {
    console.log('stop')
    socket.broadcast.emit('stopTyping');
  });
})

module.exports = router;
