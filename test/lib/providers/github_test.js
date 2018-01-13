var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

describe('github', function() {
    var sandbox;
    var repoFetcher;
    var options;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        options = sandbox.stub(require('../../../lib/options'));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should fetch repositories from GitHub', async() => {
        // arrange
        var repositories = [{
            clone_url: 'https://something', // eslint-disable-line camelcase
            ssh_url: 'ssh://something', // eslint-disable-line camelcase
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

        repoFetcher = function(options, converter) {
            expect(options).to.eql(requestOptions);
            return Promise.resolve(converter(JSON.stringify(repositories)));
        };

        options.getUsername.returns('ngeor');
        options.isNoPagination.returns(true);

        // act
        var github = proxyquire('../../../lib/providers/github', {
            '../repo_fetcher': repoFetcher,
            '../options': options
        });

        // assert
        expect(await github.getRepositories()).to.eql(repositories);
    });
});
