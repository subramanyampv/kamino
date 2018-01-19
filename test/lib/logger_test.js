const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const expect = require('chai').expect;

describe('logger', () => {
    let sandbox;
    let logger;
    let optionsParser;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.spy(console, 'log');
        sandbox.spy(console, 'error');

        optionsParser = {
            get: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('when verbose is off', () => {
        beforeEach(() => {
            logger = proxyquire('../../lib/logger', {
                './options_parser': optionsParser
            });

            optionsParser.get.returns({
                verbose: false
            });
        });

        it('should not log verbose messages', () => {
            // act
            logger.verbose('hello');

            // assert
            expect(console.log.called).to.eql(false);
        });

        it('should log regular messages', () => {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.eql(true);
        });

        it('should log error messages', () => {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.eql(true);
        });
    });

    describe('when verbose is on', () => {
        beforeEach(() => {
            optionsParser.get.returns({
                verbose: true
            });
            logger = proxyquire('../../lib/logger', {
                './options_parser': optionsParser
            });
        });

        it('should log verbose messages', () => {
            // act
            logger.verbose('hello');

            // assert
            expect(console.log.called).to.eql(true);
        });

        it('should log regular messages', () => {
            // act
            logger.log('hello');

            // assert
            expect(console.log.called).to.eql(true);
        });

        it('should log error messages', () => {
            // act
            logger.error('hello');

            // assert
            expect(console.error.called).to.eql(true);
        });
    });
});
