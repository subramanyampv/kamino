const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const sinon = require('sinon');

describe('bitbucket_cloud', () => {
  const bitbucketResponse = {
    values: [
      {
        slug: 'repoName',
        links: {
          clone: [
            {
              name: 'https',
              href: 'https://something',
            },
            {
              name: 'ssh',
              href: 'ssh://something',
            },
          ],
        },
      },
    ],
  };

  function dummyRepoFetcher(requestOptions, responseConverter) {
    return Promise.resolve(responseConverter(JSON.stringify(bitbucketResponse)));
  }

  let repoFetcher;
  let bitbucketCloud;

  beforeEach(() => {
    repoFetcher = sinon.spy(dummyRepoFetcher);
    bitbucketCloud = proxyquire('./bitbucket_cloud', {
      './repo_fetcher': repoFetcher,
    });
  });

  afterEach(() => {
    sinon.restore();
    process.env.BITBUCKET_PASSWORD = '';
  });

  it('should fetch repositories from Bitbucket Cloud', async () => {
    // arrange
    const expectedRepositories = [{
      clone_url: 'https://something',
      ssh_url: 'ssh://something',
      name: 'repoName',
    }];

    const requestOptions = {
      hostname: 'api.bitbucket.org',
      path: '/2.0/repositories/ngeor',
      port: 443,
      method: 'GET',
      headers: {
        'User-Agent': 'clone-all.js',
        Accept: 'application/json',
        Authorization: 'Basic dXNlcjE6dGVzdDEyMw==',
      },
    };

    const options = {
      owner: 'ngeor',
      username: 'user1',
      password: 'test123',
      pagination: false,
    };

    // act
    const repositories = await bitbucketCloud.getRepositories(options);

    // assert
    expect(repositories).to.eql(expectedRepositories);
    expect(repoFetcher.getCall(0).args[0]).to.eql(requestOptions);
    expect(repoFetcher.getCall(0).args[2]).to.eql(options);
  });

  describe('password', () => {
    const options = {
      owner: 'ngeor',
      username: 'user1',
      pagination: false,
    };

    describe('when BITBUCKET_PASSWORD is set', () => {
      beforeEach(() => {
        process.env.BITBUCKET_PASSWORD = 'secret';
      });

      describe('when password is provided at command line', () => {
        beforeEach(() => {
          options.password = 'test123';
        });

        it('should use the cli password', async () => {
          await bitbucketCloud.getRepositories(options);
          expect(repoFetcher.getCall(0).args[0].headers.Authorization).to.eql('Basic dXNlcjE6dGVzdDEyMw==');
        });
      });

      describe('when password is not provided at command line', () => {
        beforeEach(() => {
          options.password = '';
        });

        it('should use the env password', async () => {
          await bitbucketCloud.getRepositories(options);
          expect(repoFetcher.getCall(0).args[0].headers.Authorization).to.eql('Basic dXNlcjE6c2VjcmV0');
        });
      });
    });

    describe('when BITBUCKET_PASSWORD is not set', () => {
      beforeEach(() => {
        process.env.BITBUCKET_PASSWORD = '';
      });

      describe('when password is provided at command line', () => {
        beforeEach(() => {
          options.password = 'test123';
        });

        it('should use the cli password', async () => {
          await bitbucketCloud.getRepositories(options);
          expect(repoFetcher.getCall(0).args[0].headers.Authorization).to.eql('Basic dXNlcjE6dGVzdDEyMw==');
        });
      });

      describe('when password is not provided at command line', () => {
        beforeEach(() => {
          options.password = '';
        });

        it('should throw an error', async () => {
          expect(() => bitbucketCloud.getRepositories(options)).to.throw('password missing');
        });
      });
    });
  });
});
