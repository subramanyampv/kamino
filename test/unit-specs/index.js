const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const {
    expect
} = chai;

/**
 * Consumes the response of a handler and returns it.
 * @param {function} requestHandler An expressJS handler.
 * @returns {string} The response.
 */
function consumeResponse(requestHandler) {
    const req = {};
    let result = '';
    const res = {
        send: (html) => {
            // capture the response
            result = html;
        },
    };

    requestHandler(req, res);
    return result;
}

describe('index', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
        delete process.env.APP_VERSION;
    });

    it('should print the current app version', () => {
        // arrange
        const expressInstance = {
            get: (path, handler) => {
                // this stub implementation captures the handler
                expressInstance.get[path] = handler;
            },
            listen: sandbox.stub(),
        };

        const express = () => expressInstance;
        const packageJson = {};
        process.env.APP_VERSION = '1.2.3-beta';

        // act
        proxyquire('../../index', {
            express,
            './package.json': packageJson,
        });

        // assert
        const handler = expressInstance.get['/version'];
        expect(handler).to.be.a('function');
        expect(consumeResponse(handler)).to.eql('1.2.3-beta');
    });
});
