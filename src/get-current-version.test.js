/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');

describe('getCurrentVersion', () => {
  let gitModule;
  let pomModule;
  let getCurrentVersion;

  beforeEach(() => {
    gitModule = sinon.stub(require('./git'));
    pomModule = sinon.stub(require('./pom'));
    const getCurrentVersionModule = proxyquire('./get-current-version', {
      './git': gitModule,
      './pom': pomModule
    });

    // eslint-disable-next-line prefer-destructuring
    getCurrentVersion = getCurrentVersionModule.getCurrentVersion;
  });

  afterEach(sinon.restore);

  it('should get the current version from git', async () => {
    // arrange
    const git = {
      latestVersion: sinon.stub()
    };

    gitModule.createGit.withArgs('/tmp').returns(git);
    git.latestVersion.returns('1.2.3');

    // act and assert
    expect(await getCurrentVersion({
      dir: '/tmp',
      source: 'git'
    })).to.equal('1.2.3');
  });

  it('should get the current version from pom', async () => {
    // arrange
    pomModule.getPomVersion.withArgs('/tmp').resolves('1.2.3');

    // act and assert
    expect(await getCurrentVersion({
      dir: '/tmp',
      source: 'pom'
    })).to.equal('1.2.3');
  });
});
