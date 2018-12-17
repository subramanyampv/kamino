const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const sinon = require('sinon');

describe('bitbucket_cloud', () => {
  let sandbox;
  let repoFetcher;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fetch repositories from Bitbucket Cloud', async () => {
    // arrange
    const expectedRepositories = [{
      clone_url: 'https://something', // eslint-disable-line camelcase
      ssh_url: 'ssh://something', // eslint-disable-line camelcase
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

    const options = {
      owner: 'ngeor',
      username: 'user1',
      password: 'test123',
      pagination: false,
    };

    repoFetcher = function ($requestOptions, converter, $options) {
      expect($requestOptions).to.eql(requestOptions);
      expect($options).to.eql(options);
      return Promise.resolve(converter(JSON.stringify(bitbucketResponse)));
    };

    // act
    const bitbucketCloud = proxyquire('./bitbucket_cloud', {
      './repo_fetcher': repoFetcher,
    });

    // assert
    expect(await bitbucketCloud.getRepositories(options)).to.eql(expectedRepositories);
  });
});
