const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const passport = require('passport');
require('../../config/passport')(passport);
const Chat = require('../models/Chat');
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
  console.log(req)
  Chat.findById(req.params.name, function (err, post) {
    if (err) return next(err);
    res.json(post);
  })
});

/* SAVE CHAT */

router.post('/', passport.authenticate('jwt', {session: false}), function (req, res, next) {

  let token = getToken(req.headers);

  if (token) {
    console.log(req.body)
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

const m = (name, text, id) => ({ name, text, id })

io.on('connection', socket => {

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
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
    socket.emit('newMessage', m('', `Welcome ${data.name}.`))
    socket.broadcast
      .to(data.room)
      .emit('newMessage', m('', `User ${data.name} logged in.`))
  })

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Текст не может быть пустым')
    }
    const user = users.get(data.id)
    if (user) {
      io.to(user.room).emit('newMessage', m(user.name, data.text, data.id))
    }
    cb()
  })

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m(' ', `User ${user.name} logged out.`)
      )
    }
    cb()
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `User ${user.name} logged out.`)
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
