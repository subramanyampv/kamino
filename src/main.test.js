/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');
const path = require('path');
const chai = require('chai');
const { main } = require('./main');
const { Git } = require('./git/git');

const { expect } = chai;
chai.use(require('chai-as-promised'));
chai.use(require('../test/test-utils'));

describe('main (integration test)', () => {
  let oldProcessArgV;
  let tmpdir;

  beforeEach(() => {
    oldProcessArgV = process.argv;
    process.argv = ['node', 'main.js'];

    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
    process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'patch'];
    console.log(`Using temporary directory ${tmpdir}`);
  });

  afterEach(() => {
    process.argv = oldProcessArgV;
  });

  describe('when the git repository does not exist', () => {
    it(
      'should fail',
      () => expect(main()).to.eventually.be.rejectedWith('Not a git repository.')
    );
  });

  describe('when the git repository is empty', () => {
    let git;
    beforeEach(() => {
      git = new Git(tmpdir);
      git.init();
    });

    describe('when a text file is staged', () => {
      beforeEach(() => {
        const testFile = path.join(tmpdir, 'hello.txt');
        fs.writeFileSync(testFile, 'hello world', 'utf8');
        git.add('hello.txt');
      });

      it(
        'should fail when there are pending changes',
        () => expect(main()).to.eventually.be.rejectedWith('There are pending changes. Please commit or stash them first.')
      );

      describe('and committed', () => {
        beforeEach(() => {
          git.commit('Adding hello.txt');
        });

        describe('and not tagged', () => {
          it('should create the first tag with patch', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'patch'];
            await main();
            expect(git.latestVersion()).to.equal('0.0.1');
          });

          it('should create the first tag with 0.0.0', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', '0.0.0'];
            await main();
            expect(git.latestVersion()).to.equal('0.0.0');
          });

          it('should create the first tag with 0.0.1', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', '0.0.1'];
            await main();
            expect(git.latestVersion()).to.equal('0.0.1');
          });

          it('should create the first tag with minor', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'minor'];
            await main();
            expect(git.latestVersion()).to.equal('0.1.0');
          });

          it('should create the first tag with 0.1.0', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', '0.1.0'];
            await main();
            expect(git.latestVersion()).to.equal('0.1.0');
          });

          it('should create the first tag with major', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
            await main();
            expect(git.latestVersion()).to.equal('1.0.0');
          });

          it('should create the first tag with 1.0.0', async () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', '1.0.0'];
            await main();
            expect(git.latestVersion()).to.equal('1.0.0');
          });

          it('should not accept other tags as first tags', () => {
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', '2.0.0'];
            return expect(main()).to.be.rejectedWith('The first tag must be one of 0.0.0, 0.0.1, 0.1.0, 1.0.0.');
          });
        });

        describe('and tagged as 1.0.0', () => {
          beforeEach(() => {
            git.tag('1.0.0');
          });

          it(
            'should fail when the current commit is already tagged',
            () => expect(main()).to.eventually.be.rejectedWith('The current commit is already tagged with versions 1.0.0.')
          );
        });

        describe('and tagged as 1.2', () => {
          beforeEach(() => {
            git.tag('1.2');
          });

          it(
            'should fail when the current tag is not semver',
            () => expect(main()).to.eventually.be.rejectedWith('Current git version 1.2 is not SemVer.')
          );
        });
      });
    });

    describe('simple pom committed', () => {
      const srcDirectory = path.join(__dirname, '..', 'test', 'simple');

      beforeEach(() => {
        fs.copyFileSync(path.join(srcDirectory, 'pom.xml'), path.join(tmpdir, 'pom.xml'));
        git.add('pom.xml');
        git.commit('initial version');
      });

      describe('and tagged as 0.9.2', () => {
        beforeEach(() => {
          git.tag('0.9.2');
        });

        it('should bump 0.9.2 to 1.0.0', async () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];

          // act
          await main();

          // assert
          expect(path.join(tmpdir, 'pom.xml')).to.have.sameContentsWith(path.join(srcDirectory, 'pom-expected.xml'));
          expect(git.latestVersion()).to.equal('1.0.0');
          expect(git.hasChanges()).to.be.false;
        });

        it('should throw an error if the current branch is not master', () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
          git.checkoutNew('develop');

          // act
          return expect(main()).to.eventually.be.rejectedWith('The current branch must be master, but it was develop.');
        });

        describe('and pom.xml updated to 1.0.0', () => {
          it('should tag 1.0.0', async () => {
            // arrange
            process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
            fs.copyFileSync(path.join(srcDirectory, 'pom-expected.xml'), path.join(tmpdir, 'pom.xml'));
            git.add('pom.xml');
            git.commit('next version');

            // act
            await main();

            // assert
            expect(git.latestVersion()).to.equal('1.0.0');
            expect(git.hasChanges()).to.be.false;
          });
        });
      });

      describe('and tagged as 0.9.0', () => {
        beforeEach(() => {
          git.tag('0.9.0');
        });

        it('should throw an error when the pom version does not match the latest tag', () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];

          // act
          return expect(main()).to.eventually.be.rejectedWith('Version mismatch between git tag (0.9.0) and pom (0.9.2).');
        });
      });
    });

    it('should not accept a pom without version', () => {
      // arrange
      const srcDirectory = path.join(__dirname, '..', 'test', 'simple');
      process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
      fs.copyFileSync(path.join(srcDirectory, 'pom-no-version.xml'), path.join(tmpdir, 'pom.xml'));
      git.add('pom.xml');
      git.commit('initial version');

      // act
      return expect(main()).to.be.rejectedWith('Could not determine version of pom.xml.');
    });

    it('should not accept a pom that is not semver', () => {
      // arrange
      const srcDirectory = path.join(__dirname, '..', 'test', 'simple');
      process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'major'];
      fs.copyFileSync(path.join(srcDirectory, 'pom-not-semver.xml'), path.join(tmpdir, 'pom.xml'));
      git.add('pom.xml');
      git.commit('initial version');

      // act
      return expect(main()).to.be.rejectedWith('Version 1.0 defined in pom.xml is not SemVer.');
    });

    describe('multi module pom', () => {
      const srcDirectory = path.join(__dirname, '..', 'test', 'multi-module');

      it('should bump 3.12.0 to 3.13.0', async () => {
        // arrange
        process.argv = ['node', 'main.js', '--dir', tmpdir, '--no-push', '-v', 'minor'];
        fs.copyFileSync(path.join(srcDirectory, 'pom.xml'), path.join(tmpdir, 'pom.xml'));
        fs.mkdirSync(path.join(tmpdir, 'bar-child-module'));
        fs.mkdirSync(path.join(tmpdir, 'foo-child-module'));
        fs.copyFileSync(path.join(srcDirectory, 'bar-child-module', 'pom.xml'), path.join(tmpdir, 'bar-child-module', 'pom.xml'));
        fs.copyFileSync(path.join(srcDirectory, 'foo-child-module', 'pom.xml'), path.join(tmpdir, 'foo-child-module', 'pom.xml'));
        git.add('.');
        git.commit('initial version');
        git.tag('3.12.0');

        // act
        await main();

        // assert
        expect(path.join(tmpdir, 'pom.xml')).to.have.sameContentsWith(path.join(srcDirectory, 'pom-expected.xml'));
        expect(path.join(tmpdir, 'bar-child-module', 'pom.xml')).to.have.sameContentsWith(path.join(srcDirectory, 'bar-child-module', 'pom-expected.xml'));
        expect(path.join(tmpdir, 'foo-child-module', 'pom.xml')).to.have.sameContentsWith(path.join(srcDirectory, 'foo-child-module', 'pom-expected.xml'));
        expect(git.latestVersion()).to.equal('3.13.0');
        expect(git.hasChanges()).to.be.false;
      });
    });
  });
});
