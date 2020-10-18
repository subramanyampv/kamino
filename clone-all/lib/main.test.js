/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('main', () => {
  let cloneAll;
  let sandbox;
  let optionsParser;
  let gitProvider;
  let logger;
  let actionFactory;
  let action;

  beforeEach(() => {
    // setup a sinon sandbox
    sandbox = sinon.createSandbox();

    // stub the optionsParser
    optionsParser = sandbox.stub(require('./options_parser'));
    gitProvider = sandbox.stub(require('./git_providers/git_provider'));

    // stub the logger
    logger = sandbox.stub(require('@ngeor/js-cli-logger'));

    action = sinon.createStubInstance(require('./actions/list.action'));
    actionFactory = () => action;

    // create the system under test
    cloneAll = proxyquire('./main', {
      './actions/action.factory': actionFactory,
      './providers/git_provider': gitProvider,
      '@ngeor/js-cli-logger': logger,
      './options_parser': optionsParser,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the correct action', async () => {
    // arrange
    const repositories = [{
      slug: 'my-repo',
    }, {
      slug: 'second-repo',
    }];

    gitProvider.getRepositories.resolves(repositories);

    // act
    await cloneAll();

    // assert
    expect(action.run).calledWith({
      slug: 'my-repo',
    });
    expect(action.run).calledWith({
      slug: 'second-repo',
    });
    expect(action.run).calledTwice;
    expect(optionsParser.parse).called;
  });
});
