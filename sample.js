var mongoose = require('mongoose');
var autoincrement = require('./');

var sampleSchema = new mongoose.Schema({
  contents: String,
  size: Number
});

mongoose.connect('mongodb://localhost:27017/autoincrement');
mongoose.plugin(autoincrement);

module.exports = mongoose.model('Sample', sampleSchema);
