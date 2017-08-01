var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('repo_provider', function() {
    var sandbox;
    var options;
    var provider;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        options = sandbox.stub(require('../../lib/options'));
        provider = {
            getRepositories: sandbox.stub()
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should fetch repositories from GitHub', function() {
        // arrange
        options.getProvider.returns('github');
        provider.getRepositories.resolves([1, 2, 3]);

        // act
        var repoProvider = proxyquire('../../lib/repo_provider', {
            './providers/github': provider,
            './options': options
        });

        // assert
        return expect(repoProvider.getRepositories()).to.eventually.eql([1, 2, 3]);
    });

    it('should fetch repositories from Bitbucket Cloud', function() {
        // arrange
        options.getProvider.returns('bitbucket_cloud');
        provider.getRepositories.resolves([1, 2, 3]);

        // act
        var repoProvider = proxyquire('../../lib/repo_provider', {
            './providers/bitbucket_cloud': provider,
            './options': options
        });

        // assert
        return expect(repoProvider.getRepositories()).to.eventually.eql([1, 2, 3]);
    });
});
