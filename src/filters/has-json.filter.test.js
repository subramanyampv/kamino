const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { expect } = require('chai');
const hasJsonFilter = require('./has-json.filter');

describe('has-json.filter', () => {
  beforeEach(() => {
    sinon.stub(fs, 'existsSync');
    sinon.stub(fs, 'readFileSync');
    sinon.stub(path, 'resolve');

    path.resolve.withArgs('/c', 'tmp', 'package.json').returns('/c/tmp/package.json');
  });

  afterEach(() => sinon.restore());

  function act(hasJson) {
    return hasJsonFilter({ name: 'tmp' }, { dir: '/c', hasJson });
  }

  it('should match when null hasJson is given', () => {
    expect(act(null)).to.be.true;
  });

  it('should not match when hasJson is empty', () => {
    expect(act(';')).to.be.false;
  });

  it('should not match when the directory does not have the requested file', () => {
    fs.existsSync.withArgs('/c/tmp/package.json').returns(false);
    expect(act('package.json')).to.be.false;
  });

  describe('when the file exists', () => {
    beforeEach(() => {
      fs.existsSync.withArgs('/c/tmp/package.json').returns(true);
    });

    it('should not match when the file is empty', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns('');
      expect(act('package.json')).to.be.false;
    });

    it('should not match when the file is not json', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns('<pom></pom>');
      expect(act('package.json')).to.be.false;
    });

    it('should match when no query is provided', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
        test: 1,
      }));

      expect(act('package.json;')).to.be.true;
    });

    it('should not match when the requested property does not exist', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
        test: 1,
      }));

      expect(act('package.json;help')).to.be.false;
    });

    it('should match when the requested property exists', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
        test: 1,
      }));

      expect(act('package.json;test')).to.be.true;
    });

    it('should not match on missing nested property', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
        test: {
          blue: 1,
        },
      }));

      expect(act('package.json;test.red')).to.be.false;
    });

    it('should match on nested property', () => {
      fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
        test: {
          blue: 1,
        },
      }));

      expect(act('package.json;test.blue')).to.be.true;
    });

    describe('array contains', () => {
      it('should not match on missing array element', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          nyc: {
            reporter: [
              'lcov',
              'text-summary',
            ],
          },
        }));

        expect(act('package.json;nyc.reporter.indexOf(\'text\') >= 0')).to.be.false;
      });

      it('should match on array element', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          nyc: {
            reporter: [
              'lcov',
              'text-summary',
            ],
          },
        }));

        expect(act('package.json;nyc.reporter.indexOf(\'text-summary\') >= 0')).to.be.true;
      });
    });

    describe('string equality', () => {
      it('should match on string property', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          devDependencies: {
            eslint: '^5.11.0',
          },
        }));

        expect(act('package.json;devDependencies.eslint === \'^5.11.0\'')).to.be.true;
      });

      it('should not match on string property', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          devDependencies: {
            eslint: '^5.11.0',
          },
        }));

        expect(act('package.json;devDependencies.eslint === \'^5.12.0\'')).to.be.false;
      });
    });

    describe('string inequality', () => {
      it('should not match on string property', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          devDependencies: {
            eslint: '^5.11.0',
          },
        }));

        expect(act('package.json;devDependencies.eslint !== \'^5.11.0\'')).to.be.false;
      });

      it('should match on string property', () => {
        fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
          devDependencies: {
            eslint: '^5.11.0',
          },
        }));

        expect(act('package.json;devDependencies.eslint !== \'^5.12.0\'')).to.be.true;
      });
    });
  });
});
