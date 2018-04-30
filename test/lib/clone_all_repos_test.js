const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('clone_all_repos', function() {
    let cloneAllRepos;
    let sandbox;
    let handleRepo;
    let repositoriesToCloneInstances;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.createSandbox();

        // stub the repositoriesToCloneInstances function
        repositoriesToCloneInstances = function(repositories, options) {
            return repositories.map(x => Object.assign({}, x, {
                url: 'https://' + x.name,
                protocol: options.protocol
            }));
        };

        handleRepo = (cloneInstruction, options) =>
            Promise.resolve(Object.assign({}, cloneInstruction, {
                cloneResult: true,
                dryRun: options.dryRun
            }));

        // create the system under test
        cloneAllRepos = proxyquire('../../lib/clone_all_repos', {
            './handle_repo': handleRepo,
            './repositories_to_clone_instances': repositoriesToCloneInstances
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone the repositories', async() => {
        // arrange
        const repositories = [
            {
                name: 'abc'
            },
            {
                name: 'def'
            }
        ];

        const options = {
            protocol: 'ftp',
            dryRun: true
        };

        // act
        const result = await cloneAllRepos(repositories, options);

        // assert
        expect(result).to.eql([
            {
                cloneResult: true,
                dryRun: true,
                protocol: 'ftp',
                name: 'abc',
                url: 'https://abc'
            },
            {
                cloneResult: true,
                dryRun: true,
                protocol: 'ftp',
                name: 'def',
                url: 'https://def'
            }
        ]);
    });
});
