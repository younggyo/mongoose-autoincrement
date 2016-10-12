'use strict';
var autoIncrement = function (schema, options) {
  schema.add({
    _id: { type: Number, index: true, unique: true },
  });
  schema.pre('save', function (next) {
    var doc = this;
    if (doc.isNew) {
      getNextSeq(doc.db.db, doc.collection.name, function (err, seq) {
        if (err) next(err);
        doc._id = seq;
        next();
      });
    }
  });
};

var getNextSeq = function (db, name, callback) {
  db.collection('counters').findOneAndUpdate(
    { model: name },
    { $inc: { seq: 1 } },
    { returnOriginal: false, upsert: true },
    function (err, ret) {
      if (err) callback(err);
      callback(null, ret.value.seq);
    });
};

module.exports = autoIncrement;
