var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
require('sinon-as-promised');

describe('bitbucket_cloud', function() {
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

    it('should fetch repositories from Bitbucket Cloud', function() {
        // arrange
        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        var requestOptions = {
            hostname: 'api.bitbucket.org',
            path: '/2.0/repositories/ngeor',
            port: 443,
            method: 'GET',
            headers: {
                'User-Agent': 'clone-all.js',
                Accept: 'application/json',
                Authorization: 'Basic dXNlcjE6dGVzdDEyMw=='
            }
        };

        repoFetcher.withArgs(requestOptions)
            .resolves(repositories);
        options.getOwnerUsername.returns('ngeor');
        options.getUsername.returns('user1');
        options.getPassword.returns('test123');
        options.isNoPagination.returns(true);

        // act
        var bitbucketCloud = proxyquire('../../../lib/providers/bitbucket_cloud', {
            '../repo_fetcher': repoFetcher,
            '../options': options
        });

        // assert
        return expect(bitbucketCloud.getRepositories()).to.eventually.eql(repositories);
    });
});
