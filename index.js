'use strict';
var autoIncrement = function (schema, options) {
  schema.add({
    _id: { type: Number, index: true, unique: true },
    createAt:{ type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  });
  schema.pre('save', function (next) {
    var doc = this;
    doc.updateAt = Date.now();
    if (doc.db && doc.isNew && typeof doc._id === 'undefined') {
      return getNextSeq(doc.db.db, doc.collection.name, function (err, seq) {
        if (err) next(err);
        doc._id = seq;
        next();
      });
    }

    next();
  });
};

var getNextSeq = function (db, name, callback) {
  db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnOriginal: false, upsert: true },
    function (err, ret) {
      if (err) callback(err);
      callback(null, ret.value.seq);
    });
};

module.exports = autoIncrement;
