var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');

describe('repositoriesToCloneInstances', () => {
    var sandbox;
    var repositoriesToCloneInstances;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        repositoriesToCloneInstances = proxyquire('../../lib/repositories_to_clone_instances', {
            path: {
                join: (a, b) => a + '/' + b
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should use HTTPS', () => {
        // arrange
        var repositories = [
            {
                name: 'abc',
                clone_url: 'https://host/abc' // eslint-disable-line camelcase
            },
            {
                name: 'def',
                clone_url: 'https://host/def' // eslint-disable-line camelcase
            }
        ];

        const options = {
            output: '../target',
            protocol: 'https'
        };

        // act
        var result = repositoriesToCloneInstances(repositories, options);

        // assert
        expect(result).to.eql([
            {
                name: 'abc',
                url: 'https://host/abc',
                location: '../target/abc'
            },

            {
                name: 'def',
                url: 'https://host/def',
                location: '../target/def'
            }
        ]);
    });

    it('should use SSH', () => {
        // arrange
        var repositories = [
            {
                name: 'abc',
                ssh_url: 'ssh://host/abc' // eslint-disable-line camelcase
            },
            {
                name: 'def',
                ssh_url: 'ssh://host/def' // eslint-disable-line camelcase
            }
        ];

        const options = {
            output: '../target',
            protocol: 'ssh'
        };

        // act
        var result = repositoriesToCloneInstances(repositories, options);

        // assert
        expect(result).to.eql([
            {
                name: 'abc',
                url: 'ssh://host/abc',
                location: '../target/abc'
            },

            {
                name: 'def',
                url: 'ssh://host/def',
                location: '../target/def'
            }
        ]);
    });

    it('should use SSH with override username', () => {
        // arrange
        var repositories = [
            {
                name: 'abc',
                ssh_url: 'ssh://host/abc' // eslint-disable-line camelcase
            },
            {
                name: 'def',
                ssh_url: 'ssh://host/def' // eslint-disable-line camelcase
            }
        ];

        const options = {
            output: '../target',
            protocol: 'ssh',
            sshUsername: 'nemo'
        };

        // act
        var result = repositoriesToCloneInstances(repositories, options);

        // assert
        expect(result).to.eql([
            {
                name: 'abc',
                url: 'ssh://nemo@host/abc',
                location: '../target/abc'
            },

            {
                name: 'def',
                url: 'ssh://nemo@host/def',
                location: '../target/def'
            }
        ]);
    });
});
