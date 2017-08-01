var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');
var expect = chai.expect;

chai.use(require('chai-as-promised'));

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var repoProvider;
    var gitClone;
    var gitPull;
    var gitBundle;
    var repositoriesToCloneInstances;
    var options;

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

        cloneAll = proxyquire('../clone-all', {
            './lib/repo_provider': repoProvider,
            './lib/git_clone': gitClone,
            './lib/git_pull': gitPull,
            './lib/git_bundle': gitBundle,
            './lib/repositories_to_clone_instances': repositoriesToCloneInstances,
            './lib/options': options
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone the repositories', async() => {
        options.getBundleDirectory.returns('../bundles');
        var result = await cloneAll();
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
