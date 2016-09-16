var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('chai-as-promised'));
require('sinon-as-promised');

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var fs;
    var GitServer;
    var child_process;
    var jsonReader;
    var gitServer;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();

        fs = require('fs');

        GitServer = sandbox.stub();

        child_process = {
            exec: function() {}
        };

        gitServer = {
            getRepositories: function() {

            }
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should not throw an error when the config file is missing', function() {
        // arrange
        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .rejects('oops');

        // act
        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            child_process: child_process,
            './lib/json_reader': jsonReader,
            './lib/GitServer': GitServer
        });

        // assert
        return expect(cloneAll).to.not.be.rejected;
    });

    it('should not clone when the folder exists', function() {
        // arrange
        var data = [{
            path: '/users/ngeor/repos',
            'clone-all': {
                fetchAllPages: false
            }
        }];

        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .resolves(data);

        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        GitServer.withArgs(data[0]).returns(gitServer);
        sandbox.stub(gitServer, 'getRepositories').resolves({
            requestOptions: {},
            repositories: repositories
        });

        sandbox.stub(fs, 'stat').withArgs('repoName').callsArgWith(1, null, {});

        sandbox.spy(child_process, 'exec');

        // act
        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            child_process: child_process,
            './lib/json_reader': jsonReader,
            './lib/GitServer': GitServer
        });

        return cloneAll.then(function() {
            // assert
            expect(child_process.exec.called).to.be.false;
        });
    });

    it('should clone when the folder does not exist', function() {
        // arrange
        var data = [{
            path: '/users/ngeor/repos',
            'clone-all': {
                fetchAllPages: false
            }
        }];

        jsonReader = sandbox.stub().withArgs('clone-all-config.json')
            .resolves(data);

        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        GitServer.withArgs(data[0]).returns(gitServer);
        sandbox.stub(gitServer, 'getRepositories').resolves({
            requestOptions: {
                'clone-all': {
                    fetchAllPages: false
                }
            },
            repositories: repositories
        });

        sandbox.stub(fs, 'stat').withArgs('repoName').callsArgWith(1, 'folder does not exist', null);

        sandbox.stub(child_process, 'exec').withArgs('git clone ssh://something repoName')
            .callsArgWith(1, null, null, null);

        // act
        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            child_process: child_process,
            './lib/json_reader': jsonReader,
            './lib/GitServer': GitServer
        });

        return cloneAll.then(function() {
            // assert
            expect(child_process.exec.called).to.be.true;
        });
    });
});
