var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('chai-as-promised'));
require('sinon-as-promised');

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var GitServer;
    var GitClone;
    var gitClone;
    var options;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.sandbox.create();

        // stub the GitServer class
        GitServer = function(server) {
            this.server = server;
        };

        GitServer.prototype.getRepositories = function() {
            return Promise.resolve({
                requestOptions: this.server,
                repositories: [
                    {
                        clone_url: 'https://lalala',
                        ssh_url: 'ssh://lalala'
                    }
                ]
            });
        };

        // stub the GitClone class
        GitClone = function(options) {
            this._cloneUrl = options.cloneUrl;
            this._cloneLocation = options.cloneLocation;
            gitClone = this;
        };

        GitClone.prototype.clone = function() {
            return Promise.resolve({
                cloneLocation: this._cloneLocation,
                error: null
            });
        };

        // stub the options
        options = {
            getOutputDirectory: sandbox.stub(),
            getProtocol: sandbox.stub(),
            getSSHUsername: sandbox.stub(),
            getUsername: sandbox.stub(),
            isNoPagination: sandbox.stub()
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone the configured repositories', () => {
        // arrange
        options.getOutputDirectory.returns('../');

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/options': options,
            './lib/GitServer': GitServer,
            './lib/GitClone': GitClone
        });

        // assert
        return cloneAll.then(function() {
            expect(gitClone._cloneUrl).to.equal('ssh://lalala');
        });
    });

    it('should clone the configured repositories with HTTPS', () => {
        // arrange
        options.getProtocol.returns('https');
        options.getOutputDirectory.returns('../');
        options.isNoPagination.returns(false);

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/options': options,
            './lib/GitServer': GitServer,
            './lib/GitClone': GitClone
        });

        // assert
        return cloneAll.then(function() {
            expect(gitClone._cloneUrl).to.equal('https://lalala');
        });
    });

    it('should use the username override', () => {
        // arrange
        options.getProtocol.returns('ssh');
        options.getOutputDirectory.returns('../');
        options.isNoPagination.returns(true);
        options.getSSHUsername.returns('nemo');

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/options': options,
            './lib/GitServer': GitServer,
            './lib/GitClone': GitClone
        });

        // assert
        return cloneAll.then(function() {
            expect(gitClone._cloneUrl).to.equal('ssh://nemo@lalala');
        });
    });
});
