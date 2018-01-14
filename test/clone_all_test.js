var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');
var expect = chai.expect;

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var repoProvider;
    var gitClone;
    var gitPull;
    var gitBundle;
    var repositoriesToCloneInstances;
    var optionsParser;
    var logger;

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
            return repositories.map(x => _.assign(x, { url: 'https://' + x.name }));
        };

        // stub the gitClone function
        gitClone = cloneInstruction => Promise.resolve(_.assign(cloneInstruction, { cloneResult: true }));
        gitPull = cloneInstruction => Promise.resolve(_.assign(cloneInstruction, { pullResult: true }));
        gitBundle = cloneInstruction => Promise.resolve(_.assign(cloneInstruction, { bundleResult: true }));
        optionsParser = {
            parse: sandbox.stub()
        };

        // stub the logger
        logger = sandbox.stub(require('../lib/logger'));

        // create the system under test
        cloneAll = proxyquire('../clone-all', {
            './lib/repo_provider': repoProvider,
            './lib/git_clone': gitClone,
            './lib/git_pull': gitPull,
            './lib/git_bundle': gitBundle,
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
        var result = await cloneAll();

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

    it('should not attempt bundling when --bundle-dir parameter is missing', async() => {
        // arrange
        optionsParser.parse.returns({
            provider: 'provider',
            username: 'username'
        });

        // act & assert
        expect(await cloneAll()).to.eql([
            {
                cloneResult: true,
                pullResult: true,
                name: 'abc',
                url: 'https://abc'
            },
            {
                cloneResult: true,
                pullResult: true,
                name: 'def',
                url: 'https://def'
            }
        ]);
    });
});
