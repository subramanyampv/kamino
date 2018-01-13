var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
const expectAsyncError = require('../util').expectAsyncError;

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

    it('should resolve into the message', async() => {
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

        expect(await httpsPromise(requestOptions)).to.equal('the message');
    });

    it('should reject if status code is less than 200', async() => {
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

        await expectAsyncError(
            async() => await httpsPromise(requestOptions),
            'Error: 100');
    });

    it('should reject if status code is more than 300', async() => {
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

        await expectAsyncError(
            async() => await httpsPromise(requestOptions),
            'Error: 404');
    });

    it('should reject if the request object has an error', async() => {
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

        await expectAsyncError(
            async() => await httpsPromise(requestOptions),
            'some error');
    });
});
