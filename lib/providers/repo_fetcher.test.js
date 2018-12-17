const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('repoFetcher', () => {
  let sandbox;
  let repoFetcher;
  let httpsPromise;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    httpsPromise = sandbox.stub();

    repoFetcher = proxyquire('./repo_fetcher', {
      '../https_promise': httpsPromise,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should work when no pagination is enabled', async () => {
    const request = {
      path: '/repos',
    };

    const responseConverter = response => JSON.parse(response).repos;

    const options = {
      pagination: false,
      forks: true,
    };

    httpsPromise.withArgs(request).resolves('{ "repos": [1,2,3]}');

    expect(await repoFetcher(request, responseConverter, options)).to.eql([1, 2, 3]);
  });

  it('should work when pagination is enabled', async () => {
    const request = {
      path: '/repos',
    };

    const responseConverter = response => JSON.parse(response).repos;

    const options = {
      pagination: true,
      forks: true,
    };

    httpsPromise.resolves('not a json');
    httpsPromise.withArgs({
      path: '/repos',
    }).resolves('{ "repos": [1,2,3]}');
    httpsPromise.withArgs({
      path: '/repos?page=2',
    }).resolves('{ "repos": [4,5]}');
    httpsPromise.withArgs({
      path: '/repos?page=3',
    }).resolves('{ "repos": []}');

    expect(await repoFetcher(request, responseConverter, options)).to.eql([1, 2, 3, 4, 5]);
  });

  describe('filtering', () => {
    const responseConverter = response => response;
    const request = {
      path: '/repos',
    };

    beforeEach(() => {
      httpsPromise.resolves('not a json');
      httpsPromise.withArgs({
        path: '/repos',
      }).resolves([
        {
          id: 1,
          fork: false,
          archived: false,
        },
        {
          id: 2,
          fork: true,
          archived: false,
        },
      ]);
      httpsPromise.withArgs({
        path: '/repos?page=2',
      }).resolves([
        {
          id: 3,
          fork: true,
          archived: true,
        },
        {
          id: 4,
          fork: false,
          archived: true,
        },
      ]);
      httpsPromise.withArgs({
        path: '/repos?page=3',
      }).resolves([]);
    });

    it('should include forks', async () => {
      // arrange
      const options = {
        pagination: true,
        forks: true,
        archived: true,
      };

      // act
      const result = await repoFetcher(request, responseConverter, options);

      // assert
      expect(result.map(r => r.id)).to.eql([1, 2, 3, 4]);
    });

    it('should filter out forks', async () => {
      // arrange
      const options = {
        pagination: true,
        forks: false,
        archived: true,
      };

      // act
      const result = await repoFetcher(request, responseConverter, options);

      // assert
      expect(result.map(r => r.id)).to.eql([1, 4]);
    });

    it('should include archived', async () => {
      // arrange
      const options = {
        pagination: true,
        forks: true,
        archived: true,
      };

      // act
      const result = await repoFetcher(request, responseConverter, options);

      // assert
      expect(result.map(r => r.id)).to.eql([1, 2, 3, 4]);
    });

    it('should filter out archived', async () => {
      // arrange
      const options = {
        pagination: true,
        forks: true,
        archived: false,
      };

      // act
      const result = await repoFetcher(request, responseConverter, options);

      // assert
      expect(result.map(r => r.id)).to.eql([1, 2]);
    });
  });
});
