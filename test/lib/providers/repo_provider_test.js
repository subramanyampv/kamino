const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const expectAsyncError = require('../../util').expectAsyncError;

describe('repo_provider', function() {
    let sandbox;
    let githubProvider;
    let bitbucketCloudProvider;
    let repoProvider;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        githubProvider = {
            getRepositories: sandbox.stub()
        };
        bitbucketCloudProvider = {
            getRepositories: sandbox.stub()
        };
        repoProvider = proxyquire('../../../lib/providers/repo_provider', {
            './github': githubProvider,
            './bitbucket_cloud': bitbucketCloudProvider
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should not accept empty provider', async() => {
        // act & assert
        await expectAsyncError(
            () => repoProvider.getRepositories({}),
            'No provider specified. Use the --provider option e.g. --provider=github');
    });

    it('should fetch repositories from GitHub', async() => {
        // arrange
        const options = {
            provider: 'github'
        };

        githubProvider.getRepositories.resolves([1, 2, 3]);

        // act & assert
        expect(await repoProvider.getRepositories(options)).to.eql([1, 2, 3]);
    });

    it('should fetch repositories from Bitbucket Cloud', async() => {
        // arrange
        const options = {
            provider: 'bitbucket_cloud'
        };

        bitbucketCloudProvider.getRepositories.resolves([1, 2, 3]);

        // act & assert
        expect(await repoProvider.getRepositories(options)).to.eql([1, 2, 3]);
    });
});
