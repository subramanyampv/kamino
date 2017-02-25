var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('chai-as-promised'));

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

describe('GitServer', function() {
    var sandbox;
    var https;
    var options;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        https = {
            request: function() {}
        };

        options = {
            getUsername: sandbox.stub(),
            isNoPagination: sandbox.stub()
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should fetch the first page', function() {
        // arrange
        var request = new StubHttpsRequest();

        var repositories = [{
            clone_url: 'https://something',
            ssh_url: 'ssh://something',
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

        sandbox.stub(https, 'request').withArgs(requestOptions)
            .returns(request)
            .callsArgWith(1, new StubHttpsResponse(JSON.stringify(repositories)));
        options.getUsername.returns('ngeor');
        options.isNoPagination.returns(true);

        // act
        var GitServer = proxyquire('../../lib/GitServer', {
            https: https,
            './options': options
        });

        var gitServer = new GitServer();

        // assert
        return expect(gitServer.getRepositories()).to.eventually.eql({
            requestOptions: requestOptions,
            repositories: repositories
        });
    });
});
