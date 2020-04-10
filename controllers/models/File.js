const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = new Schema({
  image: {
    type: String,
    required: true
  },
  user: String
});

module.exports = mongoose.model('Image', Image);
