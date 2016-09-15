var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

function StubHttpsRequest() {
}

StubHttpsRequest.prototype.end = function() {};
StubHttpsRequest.prototype.on = function() {};

function StubHttpsResponse(data) {
    this.statusCode = 200;
    this._data = data;
}

StubHttpsResponse.prototype.on = function(eventName, handler) {
    if (eventName === 'data') {
        handler(this._data);
    } else if (eventName === 'end') {
        handler();
    }
};

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var fs;
    var https;
    var child_process;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();

        fs = {
            readFile: function() {},
            stat: function() {}
        };

        https = {
            request: function() {}
        };

        child_process = {
            exec: function() {}
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should throw an error when the config file is missing', function() {
        // arrange
        sandbox.stub(fs, 'readFile').withArgs('clone-all-config.json', 'utf8')
            .callsArgWith(2, 'oops', null);

        // act and assert
        expect(function() {
            cloneAll = proxyquire('../clone-all', {
                fs: fs,
                https: https,
                child_process: child_process
            });
        }).to.throw('oops');
    });

    it('should not clone when the folder exists', function() {
        // arrange
        var data = JSON.stringify([{
            path: '/users/ngeor/repos',
            'clone-all': {
                fetchAllPages: false
            }
        }]);

        var request = new StubHttpsRequest();

        sandbox.stub(fs, 'readFile').withArgs('clone-all-config.json', 'utf8')
            .callsArgWith(2, null, data);

        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        sandbox.stub(https, 'request').withArgs({
            hostname: 'api.github.com',
            path: '/users/ngeor/repos',
            port: 443,
            method: 'GET',
            headers: {
                'User-Agent': 'clone-all.js'
            },
            'clone-all': {
                fetchAllPages: false
            }
        }).returns(request).callsArgWith(1, new StubHttpsResponse(JSON.stringify(repositories)));

        sandbox.stub(fs, 'stat').withArgs('repoName').callsArgWith(1, null, {});

        sandbox.spy(child_process, 'exec');

        // act
        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            https: https,
            child_process: child_process
        });

        // assert
        expect(child_process.exec.called).to.be.false;
    });

    it('should clone when the folder does not exist', function() {
        // arrange
        var data = JSON.stringify([{
            path: '/users/ngeor/repos',
            'clone-all': {
                fetchAllPages: false
            }
        }]);

        var request = new StubHttpsRequest();

        sandbox.stub(fs, 'readFile').withArgs('clone-all-config.json', 'utf8')
            .callsArgWith(2, null, data);

        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
            name: 'repoName'
        }];

        sandbox.stub(https, 'request').withArgs({
            hostname: 'api.github.com',
            path: '/users/ngeor/repos',
            port: 443,
            method: 'GET',
            headers: {
                'User-Agent': 'clone-all.js'
            },
            'clone-all': {
                fetchAllPages: false
            }
        }).returns(request).callsArgWith(1, new StubHttpsResponse(JSON.stringify(repositories)));

        sandbox.stub(fs, 'stat').withArgs('repoName').callsArgWith(1, 'folder does not exist', null);

        sandbox.stub(child_process, 'exec').withArgs('git clone ssh://something repoName')
            .callsArgWith(1, null, null, null);

        // act
        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            https: https,
            child_process: child_process
        });
    });
});
