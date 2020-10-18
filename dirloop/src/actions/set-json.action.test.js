const fs = require('fs');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const sinon = require('sinon');
const chai = require('chai');
const { EOL } = require('os');
const setJsonAction = require('./set-json.action');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('set-json.action', () => {
  beforeEach(() => {
    sinon.stub(path, 'resolve');
    sinon.stub(fs, 'readFileSync');
    sinon.stub(fs, 'writeFileSync');
    sinon.stub(logger, 'log');
  });

  afterEach(() => sinon.restore());

  function assert(json) {
    expect(fs.writeFileSync).calledOnceWith(
      '/c/tmp/package.json',
      JSON.stringify(json, null, 2) + EOL,
      'utf8',
    );
  }

  it('should update the file', () => {
    // arrange
    const cliArgs = {
      dir: '/c',
      dryRun: false,
      setJson: 'package.json;j.color=\'blue\'',
    };

    path.resolve.withArgs('/c', 'tmp', 'package.json').returns('/c/tmp/package.json');
    fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
      color: 'red',
    }));

    // act
    setJsonAction('tmp', cliArgs);

    // assert
    assert({
      color: 'blue',
    });
  });

  it('should update array in nested object', () => {
    // arrange
    const cliArgs = {
      dir: '/c',
      dryRun: false,
      setJson: 'package.json;j.nyc.reporter=j.nyc.reporter.filter(x=>x!==\'text-summary\').concat([\'text\'])',
    };

    path.resolve.withArgs('/c', 'tmp', 'package.json').returns('/c/tmp/package.json');
    fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
      nyc: {
        reporter: [
          'lcov',
          'text-summary',
          'html',
        ],
      },
    }));

    // act
    setJsonAction('tmp', cliArgs);

    // assert
    assert({
      nyc: {
        reporter: [
          'lcov',
          'html',
          'text',
        ],
      },
    });
  });

  it('should not update the file if nothing changed', () => {
    // arrange
    const cliArgs = {
      dir: '/c',
      dryRun: false,
      setJson: 'package.json;j.color=\'red\'',
    };

    path.resolve.withArgs('/c', 'tmp', 'package.json').returns('/c/tmp/package.json');
    fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
      color: 'red',
    }));

    // act
    setJsonAction('tmp', cliArgs);

    // assert
    expect(fs.writeFileSync).not.called;
    expect(logger.log).calledWith('File /c/tmp/package.json is unmodified');
  });

  it('should not update the file if in dry run mode', () => {
    // arrange
    const cliArgs = {
      dir: '/c',
      dryRun: true,
      setJson: 'package.json;j.color=\'blue\'',
    };

    path.resolve.withArgs('/c', 'tmp', 'package.json').returns('/c/tmp/package.json');
    fs.readFileSync.withArgs('/c/tmp/package.json', 'utf8').returns(JSON.stringify({
      color: 'red',
    }));

    // act
    setJsonAction('tmp', cliArgs);

    // assert
    expect(fs.writeFileSync).not.called;
    expect(logger.log).calledWith('Would have modified file /c/tmp/package.json');
  });
});
