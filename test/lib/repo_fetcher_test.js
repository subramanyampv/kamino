const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

describe('repoFetcher', () => {
    let sandbox;
    let repoFetcher;
    let httpsPromise;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        httpsPromise = sandbox.stub();

        repoFetcher = proxyquire('../../lib/repo_fetcher', {
            './https_promise': httpsPromise
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should work when no pagination is enabled', async() => {
        const request = {
            path: '/repos'
        };

        const responseConverter = (response) => JSON.parse(response).repos;

        const options = {
            pagination: false,
            forks: true
        };

        httpsPromise.withArgs(request).resolves('{ "repos": [1,2,3]}');

        expect(await repoFetcher(request, responseConverter, options)).to.eql([1, 2, 3]);
    });

    it('should work when pagination is enabled', async() => {
        const request = {
            path: '/repos'
        };

        const responseConverter = (response) => JSON.parse(response).repos;

        const options = {
            pagination: true,
            forks: true
        };

        httpsPromise.resolves('not a json');
        httpsPromise.withArgs({
            path: '/repos'
        }).resolves('{ "repos": [1,2,3]}');
        httpsPromise.withArgs({
            path: '/repos?page=2'
        }).resolves('{ "repos": [4,5]}');
        httpsPromise.withArgs({
            path: '/repos?page=3'
        }).resolves('{ "repos": []}');

        expect(await repoFetcher(request, responseConverter, options)).to.eql([1, 2, 3, 4, 5]);
    });

    it('should filter out forks', async() => {
        const request = {
            path: '/repos'
        };

        const responseConverter = (response) => response;

        const options = {
            pagination: true,
            forks: false
        };

        httpsPromise.resolves('not a json');
        httpsPromise.withArgs({
            path: '/repos'
        }).resolves([
            {
                id: 1,
                fork: false
            },
            {
                id: 2,
                fork: true
            }
        ]);
        httpsPromise.withArgs({
            path: '/repos?page=2'
        }).resolves([
            {
                id: 3,
                fork: true
            },
            {
                id: 4,
                fork: false
            }
        ]);
        httpsPromise.withArgs({
            path: '/repos?page=3'
        }).resolves([]);

        expect(await repoFetcher(request, responseConverter, options)).to.eql([
            {
                id: 1,
                fork: false
            },
            {
                id: 4,
                fork: false
            }
        ]);
    });
});
