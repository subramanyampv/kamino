const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');
const sinon = require('sinon');

describe('github', () => {
  let sandbox;
  let repoFetcher;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fetch repositories from GitHub', async () => {
    // arrange
    const repositories = [{
      clone_url: 'https://something', // eslint-disable-line camelcase
      ssh_url: 'ssh://something', // eslint-disable-line camelcase
      name: 'repoName',
    }];

    const requestOptions = {
      hostname: 'api.github.com',
      path: '/users/ngeor/repos',
      port: 443,
      method: 'GET',
      headers: {
        'User-Agent': 'clone-all.js',
      },
    };

    const options = {
      username: 'ngeor',
      pagination: true,
    };

    repoFetcher = function ($requestOptions, converter, $options) {
      expect($requestOptions).to.eql(requestOptions);
      expect($options).to.eql(options);
      return Promise.resolve(converter(JSON.stringify(repositories)));
    };

    // act
    const github = proxyquire('./github', {
      './repo_fetcher': repoFetcher,
    });

    // assert
    expect(await github.getRepositories(options)).to.eql(repositories);
  });
});
