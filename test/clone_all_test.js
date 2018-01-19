const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const expect = chai.expect;

describe('clone-all', function() {
    let cloneAll;
    let sandbox;
    let repoProvider;
    let handleRepo;
    let repositoriesToCloneInstances;
    let optionsParser;
    let logger;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.sandbox.create();

        // stub the repoProvider module
        repoProvider = sandbox.stub(require('../lib/repo_provider'));
        repoProvider.getRepositories.resolves([
            {
                name: 'abc'
            },
            {
                name: 'def'
            }
        ]);

        // stub the repositoriesToCloneInstances function
        repositoriesToCloneInstances = function(repositories) {
            return repositories.map(x => _.assign(x, {
                url: 'https://' + x.name
            }));
        };

        handleRepo = cloneInstruction => Promise.resolve(_.assign(cloneInstruction, {
            cloneResult: true,
            pullResult: true,
            bundleResult: true
        }));
        optionsParser = {
            parse: sandbox.stub()
        };

        // stub the logger
        logger = sandbox.stub(require('../lib/logger'));

        // create the system under test
        cloneAll = proxyquire('../clone-all', {
            './lib/repo_provider': repoProvider,
            './lib/handle_repo': handleRepo,
            './lib/repositories_to_clone_instances': repositoriesToCloneInstances,
            './lib/options_parser': optionsParser,
            './lib/logger': logger
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone the repositories', async() => {
        // arrange
        optionsParser.parse.returns({
            bundleDir: '../bundles',
            provider: 'provider',
            username: 'username'
        });

        // act
        const result = await cloneAll();

        // assert
        expect(result).to.eql([
            {
                cloneResult: true,
                pullResult: true,
                bundleResult: true,
                name: 'abc',
                url: 'https://abc'
            },
            {
                cloneResult: true,
                pullResult: true,
                bundleResult: true,
                name: 'def',
                url: 'https://def'
            }
        ]);
    });
});
