var expect = require('chai').expect;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

describe('mongoose-autoIncrement', function() {

  it('should increase _id and start with 1 and increase 1', function(done) {
    // db connection
    require('./db').connect({});
    // declare SampleModel, must be initalize after db connetion
    var SampleModel = require('./sample');
    SampleModel
    // remove all sample
      .remove({}) 
    // remove all counter
      .then(doc => mongoose.model('counter', {}).remove({})) 
    // 1st insert
      .then(doc => new SampleModel({contents: 'sample', size: 1}).save()) 
    // 2nd insert
      .then(doc => new SampleModel({contents: 'sample2', size: 1}).save()) 
      .then(doc => SampleModel.find({}))
      .then(docs => {
        console.log(docs);
        expect(docs[0]._id).to.equal(1);
        expect(docs[1]._id).to.equal(2);
        mongoose.disconnect();
        done();
      })
      .catch(err => {
        console.error(err);
        expect(err).not.exist;
        done();
      });
  });
});
