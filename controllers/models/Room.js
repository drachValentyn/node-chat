const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  room_name: String,
  room_type: {type: String, default: 'none'},
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', RoomSchema);
