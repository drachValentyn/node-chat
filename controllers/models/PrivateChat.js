const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  room: String,
  nickname: String,
  message: String,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PrivateChat', ChatSchema);
