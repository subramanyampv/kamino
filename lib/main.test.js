/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

let runInvocations = [];

class MockAction {
  constructor(options) {
    this.options = options;
  }

  run(repository) {
    runInvocations.push({
      ...this.options,
      ...repository,
    });
  }
}

class MockActionFactory {
  // eslint-disable-next-line class-methods-use-this
  create(options) {
    return new MockAction(options);
  }
}

describe('main', () => {
  let cloneAll;
  let sandbox;
  let optionsParser;
  let repoProvider;
  let logger;

  beforeEach(() => {
    // setup a sinon sandbox
    sandbox = sinon.createSandbox();

    runInvocations = [];

    // stub the optionsParser
    optionsParser = sandbox.stub(require('./options_parser'));
    repoProvider = sandbox.stub(require('./providers/repo_provider'));

    // stub the logger
    logger = sandbox.stub(require('./logger'));
    logger.error = msg => console.error(msg);

    // create the system under test
    cloneAll = proxyquire('./main', {
      './actions/action.factory': MockActionFactory,
      './providers/repo_provider': repoProvider,
      './logger': logger,
      './options_parser': optionsParser,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the correct action', async () => {
    // arrange
    const options = { list: false };
    optionsParser.parse.returns(options);

    optionsParser.parse.returns(options);

    const repositories = [{
      slug: 'my-repo',
    }, {
      slug: 'second-repo',
    }];

    repoProvider.getRepositories.resolves(repositories);

    // act
    await cloneAll();

    // assert
    expect(runInvocations).to.eql([{
      list: false,
      slug: 'my-repo',
    }, {
      list: false,
      slug: 'second-repo',
    }]);
  });
});
