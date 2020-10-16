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
  Chat.findById(req.params.name, function (err, post) {
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

const m = (nickname, message, time) => ({ nickname, message, time})

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
      room: data.room,
      photo: data.photo
    })

    cb({ userId: socket.id })
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
    socket.emit('newMessage', m('admin', `Welcome ${data.name}.`))
    socket.broadcast
      .to(data.room)
      .emit('newMessage', m('admin', `${data.name} logged in.`))
  })

  socket.on('createMessage', (data, cb) => {

    if (!data.userOb.message) {
      return cb('Message can\'t be blank')
    }

    const user = users.get(data.id)

    if (user) {
      io.to(user.room).emit('newMessage', m(user.name, data.userOb.message, data.userOb.created_date))
    }
    cb()
  })

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `${user.name} logged out.`)
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
        m('admin', `${user.name} logged out.`)
      )
    }
  })

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', (data));
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('stopTyping');
  });
})

module.exports = router;
