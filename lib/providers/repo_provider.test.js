const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');
const { expectAsyncError } = require('../../test-utils');

describe('repo_provider', () => {
  let sandbox;
  let githubProvider;
  let bitbucketCloudProvider;
  let repoProvider;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    githubProvider = {
      getRepositories: sandbox.stub(),
    };
    bitbucketCloudProvider = {
      getRepositories: sandbox.stub(),
    };
    repoProvider = proxyquire('./repo_provider', {
      './github': githubProvider,
      './bitbucket_cloud': bitbucketCloudProvider,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not accept empty provider', async () => {
    // act & assert
    await expectAsyncError(
      () => repoProvider.getRepositories({}),
      'No provider specified. Use the --provider option e.g. --provider=github',
    );
  });

  it('should fetch repositories from GitHub', async () => {
    // arrange
    const options = {
      provider: 'github',
    };

    githubProvider.getRepositories.resolves([1, 2, 3]);

    // act & assert
    expect(await repoProvider.getRepositories(options)).to.eql([1, 2, 3]);
  });

  it('should fetch repositories from Bitbucket Cloud', async () => {
    // arrange
    const options = {
      provider: 'bitbucket_cloud',
    };

    bitbucketCloudProvider.getRepositories.resolves([1, 2, 3]);

    // act & assert
    expect(await repoProvider.getRepositories(options)).to.eql([1, 2, 3]);
  });
});
