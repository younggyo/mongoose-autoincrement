'use strict';
const rx = require('rx');

var autoIncrement = function (schema, options) {
  var useType = (options.type === 'string')? String : Number
  var field = {
    _id: { type: useType, index: true, unique: true }
  };

  // swith to options field
  var fieldName = getField(options);
  if(fieldName !== '_id') {
    field[getField(options)] = {type: useType, index: true, unique: true};
    delete field._id;
  }

  schema.add(field);
  schema.pre('save', function (next) {
    var doc = this;

    if (doc.db && doc.isNew && typeof doc[fieldName] === 'undefined') {
      getNextSeqObservable(doc.db.db, doc.collection.name, options)
        .retryWhen(err => {
          return err;
        })
        .subscribe(seq => {
          doc[fieldName] = seq;
          next();
        });
    } else {
      next();
    }
  });
};

var getField = function (options) {
  if(options && options.field) return options.field;
  else return '_id';
}

var getNextSeqObservable = function (db, name, options) {
  return rx.Observable.create(o => {
    db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { returnOriginal: false, upsert: true },
      function (err, ret) {
        var id;
        if (err) {
          return o.onError(err);
        } else {
          if (options.type === 'string') {
            id = ret.value.seq.toString(options.radix || 10)
          } else { // 'number'
            id = ret.value.seq;
          }
          o.onNext(id);
          return o.completed();
        }
      });
  });
};

module.exports = autoIncrement;
