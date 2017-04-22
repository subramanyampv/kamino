var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
chai.use(require('chai-as-promised'));

describe('https_promise', () => {
    var sandbox;
    var httpsPromise;
    var https;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        https = {
            request: sandbox.stub()
        };

        httpsPromise = proxyquire('../../lib/https_promise', {
            https: https
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should resolve into the message', () => {
        var requestOptions = { url: 'whatever' };
        var result = {
            statusCode: 200,
            on: sandbox.stub()
        };

        var requestObject = {
            on: sandbox.stub(),
            end: sandbox.stub()
        };

        result.on.withArgs('data').yields('the message');
        result.on.withArgs('end').yields();
        https.request.withArgs(requestOptions)
            .returns(requestObject)
            .yields(result);

        return expect(httpsPromise(requestOptions)).to.eventually.equal('the message');
    });

    it('should reject if status code is less than 200', () => {
        var requestOptions = { url: 'whatever' };
        var result = {
            statusCode: 100,
            on: sandbox.stub()
        };

        var requestObject = {
            on: sandbox.stub(),
            end: sandbox.stub()
        };

        https.request.withArgs(requestOptions)
            .returns(requestObject)
            .yields(result);

        return expect(httpsPromise(requestOptions)).to.be.rejectedWith('Error: 100');
    });

    it('should reject if status code is more than 300', () => {
        var requestOptions = { url: 'whatever' };
        var result = {
            statusCode: 404,
            on: sandbox.stub()
        };

        var requestObject = {
            on: sandbox.stub(),
            end: sandbox.stub()
        };

        https.request.withArgs(requestOptions)
            .returns(requestObject)
            .yields(result);

        return expect(httpsPromise(requestOptions)).to.be.rejectedWith('Error: 404');
    });

    it('should reject if the request object has an error', () => {
        var requestOptions = { url: 'whatever' };
        var result = {
            statusCode: 200,
            on: sandbox.stub()
        };

        var requestObject = {
            on: sandbox.stub(),
            end: sandbox.stub()
        };

        requestObject.on.withArgs('error').yields('some error');

        https.request.withArgs(requestOptions)
            .returns(requestObject)
            .yields(result);

        return expect(httpsPromise(requestOptions)).to.be.rejectedWith('some error');
    });
});
