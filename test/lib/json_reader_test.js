var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('json_reader', function() {
    var sandbox;
    var fs;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        fs = require('fs');
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should throw an error when the file is missing', function() {
        // arrange
        sandbox.stub(fs, 'readFile').withArgs('clone-all-config.json', 'utf8')
            .callsArgWith(2, new Error('oops'), null);

        // act
        var jsonReader = proxyquire('../../lib/json_reader', {
            fs: fs
        });

        // assert
        return expect(jsonReader('clone-all-config.json')).to.be.rejected;
    });

    it('should parse the json when the file is present', function() {
        // arrange
        sandbox.stub(fs, 'readFile').withArgs('clone-all-config.json', 'utf8')
            .callsArgWith(2, null, JSON.stringify({ hello: 'world' }));

        // act
        var jsonReader = proxyquire('../../lib/json_reader', {
            fs: fs
        });

        // assert
        return expect(jsonReader('clone-all-config.json')).to.eventually.eql({ hello: 'world' });
    });
});
