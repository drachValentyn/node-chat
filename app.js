const path = require('path');
const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const engines = require('consolidate');

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const mongoose = require('mongoose');
const bluebird = require('bluebird');

require('./scripts/create-default-user')(mongoose);

mongoose.Promise = bluebird;
mongoose.connect('mongodb://localhost/node-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  promiseLibrary: bluebird,
})
  .then(() => console.log('connection to db succesful'))
  .catch(() => console.error(err));

const room = require('./controllers/routes/room');
const chat = require('./controllers/routes/chat');
const auth = require('./controllers/routes/auth');
const users = require('./controllers/routes/users');
const upload = require('./controllers/routes/file');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/rooms', express.static(path.join(__dirname, 'dist')));
app.use(express.static('./uploads'));
app.use('/api/room', room);
app.use('/api/chat', chat);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/uploads', upload);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.engine('html', engines.mustache);
app.set('view engine', 'html');

module.exports = app;
