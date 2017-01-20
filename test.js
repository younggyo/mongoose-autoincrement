var expect = require('chai').expect;
var mongoose = require('mongoose');
var SampleModel = require('./sample');
mongoose.Promise = require('bluebird');

describe('mongoose-autoIncrement', function() {
  before(function(done) {
    SampleModel
      .remove({}) // remove all sample
      .then(i => mongoose.model('counter', {}).remove({})) // remove all counter
      .then(i => done());
  });

  after(function() {
    mongoose.disconnect();
  });

  it('should increase _id, start with 1 and increase 1', function(done) {
    var sample = new SampleModel({contents: 'sample', size: 1});
    var sample2 = new SampleModel({contents: 'sample2', size: 1});
    sample.save() // 1st insert
      .then(doc => sample2.save()) // 2nd insert
      .then(doc => SampleModel.find({}))
      .then(docs => {
        console.log(docs);
        expect(docs[0]._id).to.equal(1);
        expect(docs[1]._id).to.equal(2);
        done();
      })
      .catch(err => {
        console.error(err);
        expect(err).not.exist;
        done();
      });
  });
});
