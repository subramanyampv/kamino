const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('handle-repo', function() {
    let handleRepo;
    let sandbox;
    let gitClone;
    let gitPull;
    let gitBundle;

    beforeEach(function() {
        // setup a sinon sandbox
        sandbox = sinon.createSandbox();

        gitClone = sandbox.stub();
        gitPull = sandbox.stub();
        gitBundle = sandbox.stub();

        // create the system under test
        handleRepo = proxyquire('../../lib/handle_repo', {
            './git_clone': gitClone,
            './git_pull': gitPull,
            './git_bundle': gitBundle
        });
    });

    afterEach(function() {
        sandbox.restore();
    });

    describe('cloning', () => {
        it('should clone', async() => {
            // arrange
            const options = {
                provider: 'github'
            };

            const cloneInstruction = {
                url: 'url'
            };

            gitClone
                .withArgs(cloneInstruction, options)
                .resolves('success');

            // act
            const result = await handleRepo(cloneInstruction, options);

            // assert
            expect(result.clone).to.eql('success');
        });
    });

    describe('pulling', () => {
        let options;
        let cloneInstruction;

        beforeEach(() => {
            options = {
                provider: 'github'
            };

            cloneInstruction = {
                url: 'url'
            };

            gitPull
                .withArgs(cloneInstruction, options)
                .resolves('success-pull');
        });

        describe('when cloning succeeded', () => {
            beforeEach(() => {
                gitClone
                    .withArgs(cloneInstruction, options)
                    .resolves('success');
            });

            it('should not pull', async() => {
                // arrange

                // act
                const result = await handleRepo(cloneInstruction, options);

                // assert
                expect(result.pull).to.eql('skip');
            });
        });

        describe('when cloning skipped', () => {
            beforeEach(() => {
                gitClone
                    .withArgs(cloneInstruction, options)
                    .resolves('skip');
            });

            it('should pull', async() => {
                // arrange

                // act
                const result = await handleRepo(cloneInstruction, options);

                // assert
                expect(result.pull).to.eql('success-pull');
            });
        });
    });

    describe('bundling', () => {
        let options;
        let cloneInstruction;

        beforeEach(() => {
            options = {
                provider: 'github'
            };
            cloneInstruction = {
                url: 'url'
            };

            gitClone
                .withArgs(cloneInstruction, options)
                .resolves('success');

            gitPull
                .withArgs(cloneInstruction, options)
                .resolves('success');

            gitBundle
                .withArgs(cloneInstruction, options)
                .resolves('success-bundle');
        });

        it('should not attempt bundling when --bundle-dir parameter is missing', async() => {
            // act
            const result = await handleRepo(cloneInstruction, options);

            // assert
            expect(result.bundle).to.eql('skip');
        });

        it('should attempt bundling when --bundle-dir parameter is present', async() => {
            // arrange
            options.bundleDir = '../bundle/';

            // act
            const result = await handleRepo(cloneInstruction, options);

            // assert
            expect(result.bundle).to.eql('success-bundle');
        });
    });
});
