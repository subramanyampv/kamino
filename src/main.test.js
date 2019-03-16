/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const chai = require('chai');
const { main } = require('./main');

const { expect } = chai;
chai.use(require('chai-as-promised'));

function assertEqualFiles(src, dest) {
  const expectedPomContents = fs.readFileSync(src, 'utf8');
  const actualPomContents = fs.readFileSync(dest, 'utf8');
  expect(actualPomContents).to.eql(expectedPomContents);
}

describe('main (integration test)', () => {
  let oldProcessArgV;

  beforeEach(() => {
    oldProcessArgV = process.argv;
    process.argv = ['node', 'main.js'];
  });

  afterEach(() => {
    process.argv = oldProcessArgV;
  });

  describe('simple pom', () => {
    it('should bump 0.9.2 to 1.0.0', async () => {
      // arrange
      // get a temp folder
      const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
      process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
      console.log(`Using temporary directory ${tmpdir}`);
      spawnSync('git', ['init'], { cwd: tmpdir });
      fs.copyFileSync(path.join(__dirname, '..', 'test', 'simple', 'pom.xml'), path.join(tmpdir, 'pom.xml'));
      spawnSync('git', ['add', 'pom.xml'], { cwd: tmpdir });
      spawnSync('git', ['commit', '-m', 'init version'], { cwd: tmpdir });
      spawnSync('git', ['tag', '-a', '-m', 'Version 0.9.2', 'v0.9.2'], { cwd: tmpdir });

      // act
      await main();

      // assert
      const expectedPomContents = fs.readFileSync(
        path.join(__dirname, '..', 'test', 'simple', 'pom-expected.xml'), 'utf8'
      );
      const actualPomContents = fs.readFileSync(
        path.join(tmpdir, 'pom.xml'), 'utf8',
      );
      expect(actualPomContents).to.eql(expectedPomContents);
    });

    it('should throw an error if there are pending changes', () => {
      // arrange
      // get a temp folder
      const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
      process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
      console.log(`Using temporary directory ${tmpdir}`);
      spawnSync('git', ['init'], { cwd: tmpdir });
      fs.copyFileSync(path.join(__dirname, '..', 'test', 'simple', 'pom.xml'), path.join(tmpdir, 'pom.xml'));
      spawnSync('git', ['add', 'pom.xml'], { cwd: tmpdir });

      // act
      return expect(main()).to.eventually.be.rejectedWith('There are pending changes. Please commit or stash them first.');
    });
  });

  describe('multi module pom', () => {
    it('should bump 3.12.0 to 3.13.0', async () => {
      // arrange
      // get a temp folder
      const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
      process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'minor'];
      console.log(`Using temporary directory ${tmpdir}`);
      spawnSync('git', ['init'], { cwd: tmpdir });
      fs.copyFileSync(path.join(__dirname, '..', 'test', 'multi-module', 'pom.xml'), path.join(tmpdir, 'pom.xml'));
      fs.mkdirSync(path.join(tmpdir, 'bar-child-module'));
      fs.mkdirSync(path.join(tmpdir, 'foo-child-module'));
      fs.copyFileSync(path.join(__dirname, '..', 'test', 'multi-module', 'bar-child-module', 'pom.xml'), path.join(tmpdir, 'bar-child-module', 'pom.xml'));
      fs.copyFileSync(path.join(__dirname, '..', 'test', 'multi-module', 'foo-child-module', 'pom.xml'), path.join(tmpdir, 'foo-child-module', 'pom.xml'));
      spawnSync('git', ['add', '.'], { cwd: tmpdir });
      spawnSync('git', ['commit', '-m', 'init version'], { cwd: tmpdir });
      spawnSync('git', ['tag', '-a', '-m', 'Version 3.12.0', 'v3.12.0'], { cwd: tmpdir });

      // act
      await main();

      // assert
      assertEqualFiles(
        path.join(__dirname, '..', 'test', 'multi-module', 'pom-expected.xml'),
        path.join(tmpdir, 'pom.xml')
      );

      assertEqualFiles(
        path.join(__dirname, '..', 'test', 'multi-module', 'bar-child-module', 'pom-expected.xml'),
        path.join(tmpdir, 'bar-child-module', 'pom.xml')
      );

      assertEqualFiles(
        path.join(__dirname, '..', 'test', 'multi-module', 'foo-child-module', 'pom-expected.xml'),
        path.join(tmpdir, 'foo-child-module', 'pom.xml')
      );
    });
  });
});
