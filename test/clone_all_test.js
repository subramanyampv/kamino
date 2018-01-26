const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('clone-all', function() {
    let cloneAll;
    let sandbox;
    let repoProvider;
    let cloneAllRepos;
    let listAllRepos;
    let optionsParser;
    let logger;
    let repositories;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.sandbox.create();

        // stub the repoProvider module
        repositories = [
            {
                name: 'abc'
            },
            {
                name: 'def'
            }
        ];
        repoProvider = sandbox.stub(require('../lib/providers/repo_provider'));
        repoProvider.getRepositories.resolves(repositories);

        optionsParser = {
            parse: sandbox.stub()
        };

        // stub the logger
        logger = sandbox.stub(require('../lib/logger'));
        logger.error = (msg) => console.error(msg);

        cloneAllRepos = sandbox.stub();
        listAllRepos = sandbox.stub();

        // create the system under test
        cloneAll = proxyquire('../clone-all', {
            './lib/providers/repo_provider': repoProvider,
            './lib/clone_all_repos': cloneAllRepos,
            './lib/list_all_repos': listAllRepos,
            './lib/options_parser': optionsParser,
            './lib/logger': logger
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('when --list is not given', () => {
        const cloneAllReposResult = [
            {
                dummy: 'value'
            }
        ];

        beforeEach(() => {
            // arrange
            const options = {
                list: false
            };

            optionsParser.parse.returns(options);
            cloneAllRepos.withArgs(repositories, options).resolves(cloneAllReposResult);
        });

        it('should clone the repositories', async() => {
            // act
            const result = await cloneAll();

            // assert
            expect(result).to.eql(cloneAllReposResult);
        });

        it('should not call the stats command', async() => {
            // act
            await cloneAll();

            // assert
            expect(listAllRepos).to.not.have.been.called;
        });
    });

    describe('when --list is given', () => {
        beforeEach(() => {
            // arrange
            const options = {
                list: true
            };

            optionsParser.parse.returns(options);
            cloneAllRepos.rejects();
            listAllRepos.withArgs(repositories, options).returns('list!');
        });

        it('should not clone the repositories', async() => {
            // act
            await cloneAll();

            // assert
            expect(cloneAllRepos).to.not.have.been.called;
        });

        it('should call the list command', async() => {
            // act
            const result = await cloneAll();

            // assert
            expect(result).to.eql('list!');
        });
    });
});
