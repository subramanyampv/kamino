var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');

describe('repositoriesToCloneInstances', () => {
    var sandbox;
    var repositoriesToCloneInstances;
    var options;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        options = sandbox.stub(require('../../lib/options'));
        repositoriesToCloneInstances = proxyquire('../../lib/repositories_to_clone_instances', {
            './options': options,
            'path': {
                join: (a, b) => a + '/' + b
            }
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should use HTTPS', () => {
        // arrange
        var repositoryResults = {
            repositories: [
                {
                    name: 'abc',
                    clone_url: 'https://host/abc'
                },
                {
                    name: 'def',
                    clone_url: 'https://host/def'
                }
            ]
        };

        options.getOutputDirectory.returns('../target');
        options.getProtocol.returns('https');

        // act
        var result = repositoriesToCloneInstances(repositoryResults);

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
        var repositoryResults = {
            repositories: [
                {
                    name: 'abc',
                    ssh_url: 'ssh://host/abc'
                },
                {
                    name: 'def',
                    ssh_url: 'ssh://host/def'
                }
            ]
        };

        options.getOutputDirectory.returns('../target');
        options.getProtocol.returns('ssh');

        // act
        var result = repositoriesToCloneInstances(repositoryResults);

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
        var repositoryResults = {
            repositories: [
                {
                    name: 'abc',
                    ssh_url: 'ssh://host/abc'
                },
                {
                    name: 'def',
                    ssh_url: 'ssh://host/def'
                }
            ]
        };

        options.getOutputDirectory.returns('../target');
        options.getProtocol.returns('ssh');
        options.getSSHUsername.returns('nemo');

        // act
        var result = repositoriesToCloneInstances(repositoryResults);

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
