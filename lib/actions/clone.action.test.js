const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const Git = require('../git');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('clone.action', () => {
  const sandbox = sinon.createSandbox();
  let CloneActionClass;
  let fs;
  let path;
  let git;
  let logger;

  beforeEach(() => {
    fs = {
      existsSync: sandbox.stub(),
    };

    path = {
      join: (...args) => args.join('/'),
    };

    git = sandbox.stub(new Git(null));
    git.bundle.resolves(null);
    git.clone.resolves(null);
    git.pull.resolves(null);

    // eslint-disable-next-line global-require
    logger = sandbox.stub(require('@ngeor/js-cli-logger'));

    CloneActionClass = proxyquire('./clone.action', {
      fs,
      path,
      './logger': logger,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when repository does not exist locally', () => {
    beforeEach(() => {
      fs.existsSync.withArgs('/tmp/slug').returns(false);
    });

    it('should clone', async () => {
      // arrange
      const repository = {
        name: 'slug',
        ssh_url: 'ssh://localhost/slug.git',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('ssh://localhost/slug.git', '/tmp');
      expect(git.pull).not.called;
      expect(git.bundle).not.called;
      expect(logger.log).calledOnceWith('Cloning repository slug');
    });

    it('should clone with https protocol', async () => {
      // arrange
      const repository = {
        name: 'slug',
        clone_url: 'https://localhost/slug.git',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
        protocol: 'https',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('https://localhost/slug.git', '/tmp');
      expect(git.pull).not.called;
      expect(git.bundle).not.called;
    });

    it('should support custom SSH username', async () => {
      // arrange
      const repository = {
        name: 'slug',
        ssh_url: 'ssh://git@localhost/slug.git',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
        sshUsername: 'custom',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('ssh://custom@localhost/slug.git', '/tmp');
      expect(git.pull).not.called;
      expect(git.bundle).not.called;
    });

    it('should clone and bundle', async () => {
      // arrange
      const repository = {
        name: 'slug',
        ssh_url: 'ssh://localhost/slug.git',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
        bundleDir: '/tmp/bundles',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('ssh://localhost/slug.git', '/tmp');
      expect(git.pull).not.called;
      expect(git.bundle).calledOnceWith('/tmp/slug', '/tmp/bundles/slug.bundle');
    });

    it('should not clone nor bundle when --no-clone is present', async () => {
      // arrange
      const repository = {
        name: 'slug',
        ssh_url: 'ssh://localhost/slug.git',
      };

      const options = {
        output: '/tmp',
        clone: false,
        pull: true,
        bundleDir: '/tmp/bundles',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).not.called;
      expect(git.pull).not.called;
      expect(git.bundle).not.called;
    });
  });

  describe('when repository exists locally', () => {
    beforeEach(() => {
      fs.existsSync.withArgs('/tmp/slug').returns(true);
    });

    it('should pull', async () => {
      // arrange
      const repository = {
        name: 'slug',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).not.called;
      expect(git.pull).calledOnceWith('/tmp/slug');
      expect(git.bundle).not.called;
      expect(logger.log).calledOnceWith('Pulling repository slug');
    });

    it('should pull and bundle', async () => {
      // arrange
      const repository = {
        name: 'slug',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: true,
        bundleDir: '/tmp/bundles',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).not.called;
      expect(git.pull).calledOnceWith('/tmp/slug');
      expect(git.bundle).calledOnceWith('/tmp/slug', '/tmp/bundles/slug.bundle');
    });

    it('should not pull but it should bundle when no-pull is given', async () => {
      // arrange
      const repository = {
        name: 'slug',
      };

      const options = {
        output: '/tmp',
        clone: true,
        pull: false,
        bundleDir: '/tmp/bundles',
      };

      const cloneAction = new CloneActionClass(options, git);

      // act
      await cloneAction.run(repository);

      // assert
      expect(git.clone).not.called;
      expect(git.pull).not.called;
      expect(git.bundle).calledOnceWith('/tmp/slug', '/tmp/bundles/slug.bundle');
    });
  });
});
