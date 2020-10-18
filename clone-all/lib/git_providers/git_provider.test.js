const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');
const { expectAsyncError } = require('../../test-utils');

describe('git_provider', () => {
  let sandbox;
  let githubProvider;
  let bitbucketCloudProvider;
  let gitProvider;
  let optionsParser;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // eslint-disable-next-line global-require
    optionsParser = sandbox.stub(require('../options_parser'));
    // eslint-disable-next-line global-require
    githubProvider = sandbox.stub(require('./github'));
    githubProvider.getRepositories.resolves('magic-github');

    // eslint-disable-next-line global-require
    bitbucketCloudProvider = sandbox.stub(require('./bitbucket_cloud'));
    bitbucketCloudProvider.getRepositories.resolves('magic-bitbucket');

    gitProvider = proxyquire('./git_provider', {
      './github': githubProvider,
      './bitbucket_cloud': bitbucketCloudProvider,
      '../options_parser': optionsParser,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not accept empty provider', async () => {
    // arrange
    optionsParser.get.returns({});

    // act & assert
    await expectAsyncError(
      () => gitProvider.getRepositories(),
      'No provider specified. Use the --provider option e.g. --provider=github',
    );
  });

  it('should fetch repositories from GitHub', async () => {
    // arrange
    const options = {
      provider: 'github',
    };

    optionsParser.get.returns(options);

    // act & assert
    expect(await gitProvider.getRepositories()).to.eql('magic-github');
  });

  it('should fetch repositories from Bitbucket Cloud', async () => {
    // arrange
    const options = {
      provider: 'bitbucket_cloud',
    };
    optionsParser.get.returns(options);

    // act & assert
    expect(await gitProvider.getRepositories()).to.eql('magic-bitbucket');
  });

  it('should match provider name by prefix', async () => {
    // arrange
    const options = {
      provider: 'bitbucket',
    };
    optionsParser.get.returns(options);

    // act & assert
    expect(await gitProvider.getRepositories()).to.eql('magic-bitbucket');
  });

  it('should not accept unknown provider', async () => {
    // arrange
    optionsParser.get.returns({ provider: 'unknown' });

    // act & assert
    await expectAsyncError(
      () => gitProvider.getRepositories(),
      'Invalid provider: unknown. Must be one of bitbucket_cloud, github.',
    );
  });
});
