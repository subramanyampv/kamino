const sinon = require('sinon');
const { expect } = require('chai');
const logger = require('@ngeor/js-cli-logger');
const optionsParser = require('./options_parser');

describe('options_parser', () => {
  let options;
  let originalProcessExit;

  beforeEach(() => {
    sinon.stub(logger);
    process.argv = ['', '', '--provider', 'dummy', '--username', 'user'];
    originalProcessExit = process.exit;
    process.exit = () => { };
  });

  afterEach(() => {
    process.exit = originalProcessExit;
    process.argv = [];
    sinon.restore();
  });

  describe('get', () => {
    it('should get parsed options', () => {
      const parsedOptions = optionsParser.parse();
      const getOptions = optionsParser.get();
      expect(getOptions.username).to.equal('user');
      expect(getOptions).to.eql(parsedOptions);
    });
  });

  describe('provider', () => {
    beforeEach(() => {
      process.argv = ['', '', '--username', 'user'];
    });

    it('should return empty string when --provider is missing', () => {
      options = optionsParser.parse();
      expect(options.provider).to.equal('');
    });

    it('should return the provider for known providers', () => {
      process.argv.push('--provider', 'github');
      options = optionsParser.parse();
      expect(options.provider).to.equal('github');
    });

    it('should return the provider for unknown providers', () => {
      process.argv.push('--provider', 'unknown');
      options = optionsParser.parse();
      expect(options.provider).to.equal('unknown');
    });
  });

  describe('owner', () => {
    it('should return empty string when --owner is missing', () => {
      options = optionsParser.parse();
      expect(options.owner).to.equal('');
    });

    it('should return the user when --owner x is present', () => {
      process.argv.push('--owner=ngeor');
      options = optionsParser.parse();
      expect(options.owner).to.equal('ngeor');
    });
  });

  describe('username', () => {
    beforeEach(() => {
      process.argv = ['', '', '--provider', 'provider'];
    });

    it('should return empty string when --username is missing', () => {
      options = optionsParser.parse();
      expect(options.username).to.equal('');
    });

    it('should return the user when --username x is present', () => {
      process.argv.push('--username', 'ngeor');
      options = optionsParser.parse();
      expect(options.username).to.equal('ngeor');
    });
  });

  describe('password', () => {
    it('should return empty string when --password is missing', () => {
      options = optionsParser.parse();
      expect(options.password).to.equal('');
    });

    it('should return the user when --password=x is present', () => {
      process.argv.push('--password=ngeor');
      options = optionsParser.parse();
      expect(options.password).to.equal('ngeor');
    });
  });

  describe('output', () => {
    it('should return dot when --output is missing', () => {
      options = optionsParser.parse();
      expect(options.output).to.equal('.');
    });

    it('should return the directory when --output=x is present', () => {
      process.argv.push('--output=../target/');
      options = optionsParser.parse();
      expect(options.output).to.equal('../target/');
    });
  });

  describe('protocol', () => {
    it('should return ssh when --protocol is missing', () => {
      options = optionsParser.parse();
      expect(options.protocol).to.equal('ssh');
    });

    it('should return the provided value when --protocol=x is present', () => {
      process.argv.push('--protocol=https');
      options = optionsParser.parse();
      expect(options.protocol).to.equal('https');
    });
  });

  describe('ssh-username', () => {
    it('should return empty string when --ssh-username is missing', () => {
      options = optionsParser.parse();
      expect(options.sshUsername).to.equal('');
    });

    it('should return the provided value when --ssh-username=x is present', () => {
      process.argv.push('--ssh-username=override');
      options = optionsParser.parse();
      expect(options.sshUsername).to.equal('override');
    });
  });

  describe('dry-run', () => {
    it('should be false when --dry-run is missing', () => {
      options = optionsParser.parse();
      expect(options.dryRun).to.be.false;
    });

    it('should be true when --dry-run is present', () => {
      process.argv.push('--dry-run');
      options = optionsParser.parse();
      expect(options.dryRun).to.be.true;
    });
  });

  describe('verbose', () => {
    it('should be false when -v is missing', () => {
      options = optionsParser.parse();
      expect(options.verbose).to.be.false;
      expect(logger.setVerboseEnabled).calledOnceWithExactly(false);
    });

    it('should be true when -v is present', () => {
      process.argv.push('-v');
      options = optionsParser.parse();
      expect(options.verbose).to.be.true;
      expect(logger.setVerboseEnabled).calledOnceWithExactly(true);
    });
  });

  describe('no-forks', () => {
    it('should be true when --no-forks is missing', () => {
      options = optionsParser.parse();
      expect(options.forks).to.be.true;
    });

    it('should be false when --no-forks is present', () => {
      process.argv.push('--no-forks');
      options = optionsParser.parse();
      expect(options.forks).to.be.false;
    });
  });

  describe('no-archived', () => {
    it('should be true when --no-archived is missing', () => {
      options = optionsParser.parse();
      expect(options.archived).to.be.true;
    });

    it('should be false when --no-archived is present', () => {
      process.argv.push('--no-archived');
      options = optionsParser.parse();
      expect(options.archived).to.be.false;
    });
  });

  describe('list', () => {
    it('should be false when --list is missing', () => {
      options = optionsParser.parse();
      expect(options.list).to.be.false;
    });

    it('should be true when --list is present', () => {
      process.argv.push('--list');
      options = optionsParser.parse();
      expect(options.list).to.be.true;
    });
  });
});
