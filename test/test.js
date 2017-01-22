var expect = require('chai').expect;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var connection;

describe('mongoose-autoIncrement', () => {
  beforeEach(done => {
    connection = mongoose.createConnection('mongodb://localhost:27017/autoincrement-test');
    connection.on('error', console.error.bind(console));
    connection.once('open', () => done());
  });

  afterEach(done => {
    connection.db.dropDatabase(err => {
      if (err) return done(err);
      mongoose.plugins.pop();
      connection.close(done);
    });
  });

  describe('I want to use autoincrement with every models.', () => {
    it('should increase _id and start with 1 and increase 1', (done) => {
      mongoose.plugin(require('..'), {});

      var sampleSchema = new mongoose.Schema({
        contents: String
      });

      var Sample = connection.model('Sample', sampleSchema);

      new Sample({contents: 'contents 1'}).save()
        .then(doc => new Sample({contents: 'contents 2'}).save()) 
        .then(doc => Sample.find({}))
        .then(docs => {
          expect(docs[0]._id).to.equal(1);
          expect(docs[1]._id).to.equal(2);
          done();
        })
        .catch(err => done(err));
    });

    it('should increase given field and start with 1 and increase 1', (done) => {
      mongoose.plugin(require('..'), {field: 'sequence'});

      var sampleSchema = new mongoose.Schema({
        contents: String
      });

      var Sample = connection.model('Sample', sampleSchema);

      new Sample({contents: 'contents 1'}).save()
        .then(doc => new Sample({contents: 'contents 2'}).save()) 
        .then(doc => Sample.find({}))
        .then(docs => {
          expect(docs[0].sequence).to.equal(1);
          expect(docs[1].sequence).to.equal(2);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('I want to use autoincrement with only single model.', () => {
    it('should increase _id and start with 1 and increase 1', (done) => {
      var sampleSchema = new mongoose.Schema({
        contents: String
      });
      sampleSchema.plugin(require('..'));

      var Sample = connection.model('Sample', sampleSchema);

      new Sample({contents: 'contents 1'}).save()
        .then(doc => new Sample({contents: 'contents 2'}).save()) 
        .then(doc => Sample.find({}))
        .then(docs => {
          expect(docs[0]._id).to.equal(1);
          expect(docs[1]._id).to.equal(2);
          done();
        })
        .catch(err => done(err));
    });
  });

  it('should increase given field and start with 1 and increase 1', (done) => {
    var sampleSchema = new mongoose.Schema({
      contents: String
    });
    sampleSchema.plugin(require('..'), {field: 'sequence'});

    var Sample = connection.model('Sample', sampleSchema);

    new Sample({contents: 'contents 1'}).save()
      .then(doc => new Sample({contents: 'contents 2'}).save()) 
      .then(doc => Sample.find({}))
      .then(docs => {
        expect(docs[0].sequence).to.equal(1);
        expect(docs[1].sequence).to.equal(2);
        done();
      })
  });
});
