var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));

describe('bitbucket_cloud', function() {
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

    it('should fetch repositories from Bitbucket Cloud', function() {
        // arrange
        var expectedRepositories = [{
            clone_url: 'https://something', // eslint-disable-line camelcase
            ssh_url: 'ssh://something', // eslint-disable-line camelcase
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

        var bitbucketResponse = {
            values: [
                {
                    slug: 'repoName',
                    links: {
                        clone: [
                            {
                                name: 'https',
                                href: 'https://something'
                            },
                            {
                                name: 'ssh',
                                href: 'ssh://something'
                            }
                        ]
                    }
                }
            ]
        };

        repoFetcher = function(options, converter) {
            expect(options).to.eql(requestOptions);
            return Promise.resolve(converter(JSON.stringify(bitbucketResponse)));
        };

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
        return expect(bitbucketCloud.getRepositories()).to.eventually.eql(expectedRepositories);
    });
});
