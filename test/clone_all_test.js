var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');
var expect = chai.expect;

chai.use(require('chai-as-promised'));
require('sinon-as-promised');

describe('clone-all', function() {
    var cloneAll;
    var sandbox;
    var repoProvider;
    var gitClone;
    var repositoriesToCloneInstances;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.sandbox.create();

        // stub the repoProvider module
        repoProvider = sandbox.stub(require('../lib/repo_provider'));
        repoProvider.getRepositories.returns(Promise.resolve({
            requestOptions: this.server,
            repositories: [
                {
                    name: 'abc'
                },
                {
                    name: 'def'
                }
            ]
        }));

        // stub the repositoriesToCloneInstances function
        repositoriesToCloneInstances = function(repositoryResults) {
            return repositoryResults.repositories.map(x => _.assign(x, { url: 'https://' + x.name }));
        };

        // stub the gitClone function
        gitClone = function(cloneInstruction) {
            return Promise.resolve(_.assign(cloneInstruction, { check: true }));
        };

        cloneAll = proxyquire('../clone-all', {
            './lib/repo_provider': repoProvider,
            './lib/git_clone': gitClone,
            './lib/repositories_to_clone_instances': repositoriesToCloneInstances
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should clone the repositories', () => {
        return cloneAll.then(function(result) {
            expect(result).to.eql([
                {
                    check: true,
                    name: 'abc',
                    url: 'https://abc'
                },
                {
                    check: true,
                    name: 'def',
                    url: 'https://def'
                }
            ]);
        });
    });
});
