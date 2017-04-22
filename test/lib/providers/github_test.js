var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
require('sinon-as-promised');

describe('github', function() {
    var sandbox;
    var repoFetcher;
    var options;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        repoFetcher = sandbox.stub();
        options = sandbox.stub(require('../../../lib/options'));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should fetch repositories from GitHub', function() {
        // arrange
        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        var requestOptions = {
            hostname: 'api.github.com',
            path: '/users/ngeor/repos',
            port: 443,
            method: 'GET',
            headers: {
                'User-Agent': 'clone-all.js'
            }
        };

        repoFetcher.withArgs(requestOptions)
            .resolves(repositories);
        options.getUsername.returns('ngeor');
        options.isNoPagination.returns(true);

        // act
        var github = proxyquire('../../../lib/providers/github', {
            '../repo_fetcher': repoFetcher,
            '../options': options
        });

        // assert
        return expect(github.getRepositories()).to.eventually.eql(repositories);
    });
});
