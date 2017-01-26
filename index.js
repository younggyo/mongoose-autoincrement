'use strict';
var autoIncrement = function (schema, options) {
  var field = {
    _id: { type: Number, index: true, unique: true },
    createAt:{ type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  };

  // swith to options field
  var fieldName = getField(options);
  if(fieldName !== '_id') {
    field[getField(options)] = {type: Number, unique: true};
    delete field._id;
  }

  schema.add(field);
  schema.pre('save', function (next) {
    var doc = this;
    doc.updateAt = Date.now();
    if (doc.db && doc.isNew && typeof doc[fieldName] === 'undefined') {
      return getNextSeq(doc.db.db, doc.collection.name, function (err, seq) {
        if (err) next(err);
        doc[fieldName] = seq;
        next();
      });
    }

    next();
  });
};

var getField = function (options) {
  if(options && options.field) return options.field;
  else return '_id';
}

var getNextSeq = function (db, name, callback) {
  db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnOriginal: false, upsert: true },
    function (err, ret) {
      if (err) callback(err);
      else callback(null, ret.value.seq);
    });
};

module.exports = autoIncrement;
