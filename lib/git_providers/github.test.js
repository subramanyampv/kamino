const sinon = require('sinon');
const { expect } = require('chai');
const github = require('./github');
const optionsParser = require('../options_parser');
const httpsPromise = require('../https_promise');

describe('github', () => {
  beforeEach(() => {
    sinon.stub(optionsParser);
    sinon.stub(httpsPromise);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should fetch repositories from GitHub', async () => {
    // arrange
    const repositoriesFirstCall = [{
      clone_url: 'https://something',
      ssh_url: 'ssh://something',
      name: 'something',
    }];

    const repositoriesSecondCall = [{
      clone_url: 'https://something-else',
      ssh_url: 'ssh://something-else',
      name: 'something-else',
    }];

    const expectedRepositories = repositoriesFirstCall.concat(repositoriesSecondCall);

    const requestOptions = {
      method: 'GET',
      headers: {
        'User-Agent': 'clone-all.js',
      },
    };

    const options = {
      username: 'ngeor',
    };
    optionsParser.get.returns(options);

    httpsPromise.request.withArgs('https://api.github.com/users/ngeor/repos', requestOptions).resolves({
      headers: {
        link: '<https://api.github.com/ngeor/page2>; rel="next"',
      },
      message: JSON.stringify(repositoriesFirstCall),
    });

    httpsPromise.request.withArgs('https://api.github.com/ngeor/page2', requestOptions).resolves({
      headers: {
        link: '<https://api.github.com/ngeor>; rel="first"',
      },
      message: JSON.stringify(repositoriesSecondCall),
    });

    // act
    const result = await github.getRepositories();

    // assert
    expect(result).to.eql(expectedRepositories);
  });

  describe('--no-forks', () => {
    const repositories = [
      {
        clone_url: 'https://some-fork',
        ssh_url: 'ssh://some-fork',
        name: 'some-fork',
        fork: true,
      },
      {
        clone_url: 'https://some-spoon',
        ssh_url: 'ssh://some-spoon',
        name: 'some-spoon',
        fork: false,
      },
    ];

    beforeEach(() => {
      httpsPromise.request.resolves({
        headers: {
          link: '',
        },
        message: JSON.stringify(repositories),
      });
    });

    it('should exclude forks when --no-forks is passed', async () => {
      // arrange
      const options = {
        username: 'ngeor',
        forks: false,
      };
      optionsParser.get.returns(options);

      // act
      const result = await github.getRepositories();

      // assert
      expect(result.map(r => r.name)).to.eql(['some-spoon']);
    });

    it('should include forks when --no-forks is not passed', async () => {
      // arrange
      const options = {
        username: 'ngeor',
        forks: true,
      };
      optionsParser.get.returns(options);

      // act
      const result = await github.getRepositories();

      // assert
      expect(result.map(r => r.name)).to.eql(['some-fork', 'some-spoon']);
    });
  });

  describe('--no-archived', () => {
    const repositories = [
      {
        clone_url: 'https://some-archived',
        ssh_url: 'ssh://some-archived',
        name: 'some-archived',
        archived: true,
      },
      {
        clone_url: 'https://some-spoon',
        ssh_url: 'ssh://some-spoon',
        name: 'some-spoon',
        archived: false,
      },
    ];

    beforeEach(() => {
      httpsPromise.request.resolves({
        headers: {
          link: '',
        },
        message: JSON.stringify(repositories),
      });
    });

    it('should exclude archived when --no-archived is passed', async () => {
      // arrange
      const options = {
        username: 'ngeor',
        archived: false,
      };
      optionsParser.get.returns(options);

      // act
      const result = await github.getRepositories();

      // assert
      expect(result.map(r => r.name)).to.eql(['some-spoon']);
    });

    it('should include archived when --no-archived is not passed', async () => {
      // arrange
      const options = {
        username: 'ngeor',
        archived: true,
      };
      optionsParser.get.returns(options);

      // act
      const result = await github.getRepositories();

      // assert
      expect(result.map(r => r.name)).to.eql(['some-archived', 'some-spoon']);
    });
  });
});
