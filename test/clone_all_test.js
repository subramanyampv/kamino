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
    var options;
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
        options = sandbox.stub(require('../lib/options'));

        // stub the logger
        logger = sandbox.stub(require('../lib/logger'));

        // create the system under test
        cloneAll = proxyquire('../clone-all', {
            './lib/repo_provider': repoProvider,
            './lib/git_clone': gitClone,
            './lib/git_pull': gitPull,
            './lib/git_bundle': gitBundle,
            './lib/repositories_to_clone_instances': repositoriesToCloneInstances,
            './lib/options': options,
            './lib/logger': logger
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should print help and exit if --help is given', async() => {
        // arrange
        options.isHelp.returns(true);

        // act
        var result = await cloneAll();

        // assert
        expect(result).to.eql([]);
        expect(logger.log).to.have.been.calledWith('Use clone-all to clone all your repositories.');
    });

    it('should print help and exit if --provider is not given', async() => {
        // arrange
        options.getUsername.returns('username'); // username is given, but it's not enough

        // act
        var result = await cloneAll();

        // assert
        expect(result).to.eql([]);
        expect(logger.log).to.have.been.calledWith('Use clone-all to clone all your repositories.');
    });

    it('should print help and exit if --username is not given', async() => {
        // arrange
        options.getProvider.returns('provider'); // provider is given, but it's not enough

        // act
        var result = await cloneAll();

        // assert
        expect(result).to.eql([]);
        expect(logger.log).to.have.been.calledWith('Use clone-all to clone all your repositories.');
    });

    it('should clone the repositories', async() => {
        // arrange
        options.getBundleDirectory.returns('../bundles');
        options.getProvider.returns('provider');
        options.getUsername.returns('username');

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
        options.getProvider.returns('provider');
        options.getUsername.returns('username');

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
