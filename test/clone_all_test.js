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
    var jsonReader;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.sandbox.create();

        // stub the GitServer class
        GitServer = function(server) {
            this.server = server;
        };

        GitServer.prototype.getRepositories = function() {
            return {
                requestOptions: this.server,
                repositories: [
                    {
                        clone_url: 'https://lalala',
                        ssh_url: 'ssh://lalala'
                    }
                ]
            };
        };

        // stub the GitClone class
        GitClone = function(options) {
            this._cloneUrl = options.cloneUrl;
            this._cloneLocation = options.cloneLocation;
            gitClone = this;
        };

        GitClone.prototype.clone = function() {
            return Promise.resolve({

            });
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should not throw an error when the config file is missing', () => {
        // arrange
        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .rejects('oops');

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/json_reader': jsonReader,
            './lib/GitServer': GitServer,
            './lib/GitClone': GitClone
        });

        // assert
        return expect(cloneAll).to.not.be.rejected;
    });

    it('should clone the configured repositories', () => {
        // arrange
        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .resolves([
                {
                    path: '/users/ngeor/repos',
                    'clone-all': {
                        'fetchAllPages': true,
                        'localFolder': '../'
                    }
                }
            ]);

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/json_reader': jsonReader,
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
        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .resolves([
                {
                    path: '/users/ngeor/repos',
                    'clone-all': {
                        'fetchAllPages': true,
                        'localFolder': '../',
                        'useHTTPS': true
                    }
                }
            ]);

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/json_reader': jsonReader,
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
        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .resolves([
                {
                    path: '/users/ngeor/repos',
                    'clone-all': {
                        'fetchAllPages': true,
                        'localFolder': '../',
                        'forceUsername': 'nemo'
                    }
                }
            ]);

        // act
        cloneAll = proxyquire('../clone-all', {
            './lib/json_reader': jsonReader,
            './lib/GitServer': GitServer,
            './lib/GitClone': GitClone
        });

        // assert
        return cloneAll.then(function() {
            expect(gitClone._cloneUrl).to.equal('ssh://nemo@lalala');
        });
    });
});
