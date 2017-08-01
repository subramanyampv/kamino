var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('repo_provider', function() {
    var sandbox;
    var options;
    var githubProvider;
    var bitbucketCloudProvider;
    var repoProvider;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        options = sandbox.stub(require('../../lib/options'));
        githubProvider = {
            getRepositories: sandbox.stub()
        };
        bitbucketCloudProvider = {
            getRepositories: sandbox.stub()
        };
        repoProvider = proxyquire('../../lib/repo_provider', {
            './providers/github': githubProvider,
            './providers/bitbucket_cloud': bitbucketCloudProvider,
            './options': options
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should not accept empty provider', () => {
        // act & assert
        return expect(repoProvider.getRepositories()).to.eventually.be.rejectedWith('No provider specified. Use the --provider option e.g. --provider=github');
    });

    it('should fetch repositories from GitHub', () => {
        // arrange
        options.getProvider.returns('github');
        githubProvider.getRepositories.resolves([1, 2, 3]);

        // act & assert
        return expect(repoProvider.getRepositories()).to.eventually.eql([1, 2, 3]);
    });

    it('should fetch repositories from Bitbucket Cloud', () => {
        // arrange
        options.getProvider.returns('bitbucket_cloud');
        bitbucketCloudProvider.getRepositories.resolves([1, 2, 3]);

        // act & assert
        return expect(repoProvider.getRepositories()).to.eventually.eql([1, 2, 3]);
    });
});
