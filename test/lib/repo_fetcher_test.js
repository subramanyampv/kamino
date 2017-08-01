var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
chai.use(require('chai-as-promised'));

describe('repoFetcher', () => {
    var sandbox;
    var repoFetcher;
    var httpsPromise;
    var options;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        httpsPromise = sandbox.stub();
        options = sandbox.stub(require('../../lib/options'));

        repoFetcher = proxyquire('../../lib/repo_fetcher', {
            './https_promise': httpsPromise,
            './options': options
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should work when no pagination is enabled', () => {
        var request = {
            path: '/repos'
        };

        var responseConverter = (response) => JSON.parse(response).repos;

        options.isNoPagination.returns(true);
        httpsPromise.withArgs(request).resolves('{ "repos": [1,2,3]}');

        return expect(repoFetcher(request, responseConverter)).to.eventually.eql([1, 2, 3]);
    });

    it('should work when pagination is enabled', () => {
        var request = {
            path: '/repos'
        };

        var responseConverter = (response) => JSON.parse(response).repos;

        options.isNoPagination.returns(false);
        httpsPromise.resolves('not a json');
        httpsPromise.withArgs({ path: '/repos'}).resolves('{ "repos": [1,2,3]}');
        httpsPromise.withArgs({ path: '/repos?page=2'}).resolves('{ "repos": [4,5]}');
        httpsPromise.withArgs({ path: '/repos?page=3'}).resolves('{ "repos": []}');

        return expect(repoFetcher(request, responseConverter)).to.eventually.eql([1, 2, 3, 4, 5]);
    });
});
