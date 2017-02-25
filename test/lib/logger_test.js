var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var expect = require('chai').expect;

describe('logger', function() {
    var sandbox;
    var logger;
    var options;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
        sandbox.spy(console, 'log');
        sandbox.spy(console, 'error');

        options = {
            isVerbose: sandbox.stub()
        };
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('when no options are passed', function() {
        beforeEach(function() {
            logger = proxyquire('../../lib/logger', {
                './options': options
            });
        });

        it('should not log regular messages', function() {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.be.false;
        });

        it('should log error messages', function() {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.be.true;
        });
    });

    describe('when verbose option is passed', function() {
        beforeEach(function() {
            options.isVerbose.returns(true);
            logger = proxyquire('../../lib/logger', {
                './options': options
            });
        });

        it('should log regular messages', function() {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.be.true;
        });

        it('should log error messages', function() {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.be.true;
        });
    });
});
