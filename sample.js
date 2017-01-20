var mongoose = require('mongoose');

var sampleSchema = new mongoose.Schema({
  contents: String,
  size: Number
});

module.exports = mongoose.model('Sample', sampleSchema);
