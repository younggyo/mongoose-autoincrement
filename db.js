var mongoose = require('mongoose');
var autoincrement = require('./');

module.exports.connect = function(options) {
  mongoose.connect('mongodb://localhost:27017/autoincrement');
  mongoose.plugin(autoincrement);
}
