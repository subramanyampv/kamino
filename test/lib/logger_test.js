var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var expect = require('chai').expect;

describe('logger', () => {
    var sandbox;
    var logger;
    var options;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.spy(console, 'log');
        sandbox.spy(console, 'error');

        options = {
            isVerbose: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('when no options are passed', () => {
        beforeEach(() => {
            logger = proxyquire('../../lib/logger', {
                './options': options
            });
        });

        it('should not log verbose messages', () => {
            // act
            logger.verbose('hello');

            // assert
            expect(console.log.called).to.be.false;
        });

        it('should log regular messages', () => {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.be.true;
        });

        it('should log error messages', () => {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.be.true;
        });
    });

    describe('when verbose option is passed', () => {
        beforeEach(() => {
            options.isVerbose.returns(true);
            logger = proxyquire('../../lib/logger', {
                './options': options
            });
        });

        it('should log verbose messages', () => {
            // act
            logger.verbose('hello');

            // assert
            expect(console.log.called).to.be.true;
        });

        it('should log regular messages', () => {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.be.true;
        });

        it('should log error messages', () => {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.be.true;
        });
    });
});
