var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var fs;
    var https;
    var promise;
    var child_process;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();

        fs = {
            readFile: function() {}
        };
        https = {};
        promise = {};
        child_process = {
            exec: function() {}
        };

        cloneAll = proxyquire('../clone-all', {
            fs: fs,
            https: https,
            promise: promise,
            child_process: child_process
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone all repositories', function() {

    });
});
