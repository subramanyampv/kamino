const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expectAsyncError } = require('../test-utils');

describe('https_promise', () => {
  let sandbox;
  let httpsPromise;
  let https;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    https = {
      request: sandbox.stub(),
    };

    httpsPromise = proxyquire('./https_promise', {
      https,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should resolve into the message', async () => {
    const requestOptions = {
      url: 'whatever',
    };
    const result = {
      statusCode: 200,
      on: sandbox.stub(),
    };

    const requestObject = {
      on: sandbox.stub(),
      end: sandbox.stub(),
    };

    result.on.withArgs('data').yields('the message');
    result.on.withArgs('end').yields();
    https.request.withArgs(requestOptions)
      .returns(requestObject)
      .yields(result);

    expect(await httpsPromise(requestOptions)).to.equal('the message');
  });

  it('should reject if status code is less than 200', async () => {
    const requestOptions = {
      url: 'whatever',
    };
    const result = {
      statusCode: 100,
      on: sandbox.stub(),
    };

    const requestObject = {
      on: sandbox.stub(),
      end: sandbox.stub(),
    };

    https.request.withArgs(requestOptions)
      .returns(requestObject)
      .yields(result);

    await expectAsyncError(
      () => httpsPromise(requestOptions),
      'Error: 100',
    );
  });

  it('should reject if status code is more than 300', async () => {
    const requestOptions = {
      url: 'whatever',
    };
    const result = {
      statusCode: 404,
      on: sandbox.stub(),
    };

    const requestObject = {
      on: sandbox.stub(),
      end: sandbox.stub(),
    };

    https.request.withArgs(requestOptions)
      .returns(requestObject)
      .yields(result);

    await expectAsyncError(
      () => httpsPromise(requestOptions),
      'Error: 404',
    );
  });

  it('should reject if the request object has an error', async () => {
    const requestOptions = {
      url: 'whatever',
    };
    const result = {
      statusCode: 200,
      on: sandbox.stub(),
    };

    const requestObject = {
      on: sandbox.stub(),
      end: sandbox.stub(),
    };

    requestObject.on.withArgs('error').yields('some error');

    https.request.withArgs(requestOptions)
      .returns(requestObject)
      .yields(result);

    await expectAsyncError(
      () => httpsPromise(requestOptions),
      'some error',
    );
  });
});
