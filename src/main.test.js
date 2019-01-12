const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chai = require('chai');
const fs = require('fs');
const path = require('path');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('main (integration test)', () => {
  let mainModule;
  let main;
  let gitModule;
  let oldProcessArgV;

  before(() => {
    oldProcessArgV = process.argv;
    process.argv = ['node', 'main.js'];

    sinon.stub(fs, 'writeFileSync');

    // eslint-disable-next-line global-require
    gitModule = sinon.stub(require('./git'));

    mainModule = proxyquire('./main', {
      './git': gitModule,
    });

    // eslint-disable-next-line prefer-destructuring
    main = mainModule.main;
  });

  after(() => {
    sinon.restore();
    process.argv = oldProcessArgV;
  });

  it('should tag latest on a folder without pom', async () => {
    // arrange
    const git = {
      latestVersion: sinon.stub(),
      commit: sinon.stub(),
      tag: sinon.stub(),
      push: sinon.stub(),
    };

    git.latestVersion.returns('1.2.2');

    gitModule.createGit.withArgs('.').returns(git);

    process.argv = ['node', 'main.js', '-v', '1.2.3'];

    // act
    await main();

    // assert
    expect(git.commit).calledOnceWith('Bumping version 1.2.3');
    expect(git.tag).calledOnceWith('1.2.3');
    expect(git.push).calledOnce;
  });

  it('should tag latest on a folder with pom', async () => {
    // arrange
    const git = {
      latestVersion: sinon.stub(),
      add: sinon.stub(),
      commit: sinon.stub(),
      tag: sinon.stub(),
      push: sinon.stub(),
    };

    git.latestVersion.returns('0.9.2');

    gitModule.createGit.withArgs('./test/simple').returns(git);

    process.argv = [
      'node',
      'main.js',
      '-v',
      '0.10.0',
      '--dir',
      './test/simple',
    ];

    // act
    await main();

    // assert
    expect(git.add).calledOnceWith('pom.xml');
    expect(git.commit).calledOnceWith('Bumping version 0.10.0');
    expect(git.tag).calledOnceWith('0.10.0');
    expect(git.push).calledOnce;
  });

  it('should retag on a folder with pom', async () => {
    // arrange
    const git = {
      latestVersion: sinon.stub(),
      versionExists: sinon.stub(),
      tag: sinon.stub(),
      push: sinon.stub(),
    };

    gitModule.createGit.withArgs('./test/simple').returns(git);

    process.argv = [
      'node',
      'main.js',
      '--re-tag',
      '--source',
      'pom',
      '--dir',
      './test/simple',
    ];

    // act
    await main();

    // assert
    expect(git.tag).calledOnceWith('0.9.2');
    expect(git.push).calledOnceWith('push');
  });

  it('should tag on a folder with multi-module pom', async () => {
    // arrange
    const git = {
      latestVersion: sinon.stub(),
      add: sinon.stub(),
      commit: sinon.stub(),
      tag: sinon.stub(),
      push: sinon.stub(),
    };

    git.latestVersion.returns('3.12.0');

    gitModule.createGit.withArgs('./test/multi-module').returns(git);

    process.argv = [
      'node',
      'main.js',
      '-v',
      'minor',
      '--dir',
      './test/multi-module',
    ];

    // act
    await main();

    // assert
    expect(git.add).calledWith('pom.xml');
    expect(git.add).calledWith(path.join('bar-child-module', 'pom.xml'));
    expect(git.add).calledWith(path.join('foo-child-module', 'pom.xml'));
    expect(git.add).calledThrice;
    expect(git.commit).calledOnceWith('Bumping version 3.13.0');
    expect(git.tag).calledOnceWith('3.13.0');
    expect(git.push).calledOnceWith('follow');
  });
});
