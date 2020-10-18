const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('clone.action', () => {
  const sandbox = sinon.createSandbox();
  let CloneAction;
  let cloneAction;
  let fs;
  let path;
  let git;
  let optionsParser;
  let logger;

  beforeEach(() => {
    fs = {
      existsSync: sandbox.stub(),
    };

    path = {
      join: (...args) => args.join('/'),
    };

    // eslint-disable-next-line global-require
    optionsParser = sandbox.stub(require('../options_parser'));

    // eslint-disable-next-line global-require
    git = sandbox.stub(require('../git'));

    // eslint-disable-next-line global-require
    logger = sandbox.stub(require('@ngeor/js-cli-logger'));

    CloneAction = proxyquire('./clone.action', {
      fs,
      path,
      '@ngeor/js-cli-logger': logger,
      '../git': git,
      '../options_parser': optionsParser,
    });
    cloneAction = new CloneAction();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when repository does not exist locally', () => {
    beforeEach(() => {
      fs.existsSync.withArgs('/tmp/slug').returns(false);
    });

    it('should clone', () => {
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

      optionsParser.get.returns(options);

      // act
      cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('ssh://localhost/slug.git', '/tmp');
      expect(logger.log).calledOnceWith('Cloning repository slug');
    });

    it('should clone with https protocol', () => {
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

      optionsParser.get.returns(options);

      // act
      cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('https://localhost/slug.git', '/tmp');
    });

    it('should support custom SSH username', () => {
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

      optionsParser.get.returns(options);

      // act
      cloneAction.run(repository);

      // assert
      expect(git.clone).calledOnceWith('ssh://custom@localhost/slug.git', '/tmp');
    });
  });

  describe('when repository exists locally', () => {
    beforeEach(() => {
      fs.existsSync.withArgs('/tmp/slug').returns(true);
    });

    it('should not clone', () => {
      // arrange
      const repository = {
        name: 'slug',
      };

      const options = {
        output: '/tmp',
      };

      optionsParser.get.returns(options);

      // act
      cloneAction.run(repository);

      // assert
      expect(git.clone).not.called;
    });
  });
});
