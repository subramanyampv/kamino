/* eslint-disable no-console */
const fs = require('fs');
const os = require('os');
const path = require('path');
const chai = require('chai');
const { main } = require('./main');
const { Git } = require('./git/git');
const { updateXml } = require('./xml');

const { expect } = chai;
chai.use(require('chai-as-promised'));
chai.use(require('../test/test-utils'));

describe('main (integration test)', () => {
  let oldProcessArgV;

  /**
   * The text fixture directory to copy files from.
   */
  let sourceDirectory;

  /**
   * The temporary directory to copy files into in order to run tests.
   */
  let tempDirectory;

  /**
   * Concatenates the given filename with the temp directory.   *
   * @param {string} filename The filename, relative to the temporary directory.
   */
  function inTemp(filename) {
    if (!tempDirectory) {
      throw new Error('tempDirectory is not set');
    }

    if (!filename) {
      throw new Error('filename is mandatory');
    }

    return path.join(tempDirectory, filename);
  }

  /**
   * Copies a file from sourceDirectory into the tempDirectory.
   * @param {string} src The source filename, relative to sourceDirectory.
   * @param {string} dest The destination filename, relative to tempDirectory.
   */
  function copy(src, dest) {
    if (!sourceDirectory) {
      throw new Error('sourceDirectory not set');
    }

    if (!src) {
      throw new Error('src parameter is mandatory');
    }

    fs.copyFileSync(path.join(sourceDirectory, src), inTemp(dest || src));
  }

  beforeEach(() => {
    oldProcessArgV = process.argv;
    process.argv = ['node', 'main.js'];

    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
    process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'patch'];
    console.log(`Using temporary directory ${tempDirectory}`);
  });

  afterEach(() => {
    process.argv = oldProcessArgV;
  });

  describe('when there is no git repository', () => {
    it(
      'should fail',
      () => expect(main()).to.eventually.be.rejectedWith('Not a git repository.')
    );
  });

  describe('when there are pending changes', () => {
    beforeEach(async () => {
      const git = new Git(tempDirectory);
      await git.initAsync();
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
      git.add('hello.txt');
    });

    it(
      'should fail',
      () => expect(main()).to.eventually.be.rejectedWith('There are pending changes. Please commit or stash them first.')
    );
  });

  describe('when there are no existing git versions', () => {
    let git;
    beforeEach(() => {
      git = new Git(tempDirectory);
      git.init();
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
      git.add('hello.txt');
      git.commit('Adding hello.txt');
    });

    const happyFlows = [
      {
        argument: 'patch',
        expectedVersion: '0.0.1'
      },
      {
        argument: 'minor',
        expectedVersion: '0.1.0'
      },
      {
        argument: 'major',
        expectedVersion: '1.0.0'
      },
      '0.0.0',
      '0.0.1',
      '0.1.0',
      '1.0.0'
    ];

    happyFlows.forEach((x) => {
      const argument = typeof x === 'string' ? x : x.argument;
      const expectedVersion = typeof x === 'string' ? x : x.expectedVersion;
      it(`should accept argument ${argument} and tag ${expectedVersion}`, async () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
        const currentSha = git.currentSha();
        await main();
        expect(git.latestVersion()).to.equal(expectedVersion);
        expect(git.currentSha()).to.equal(currentSha);
      });
    });

    const failFlows = [
      '0.0.2',
      '0.2.0',
      '2.0.0'
    ];

    failFlows.forEach((x) => {
      it(`should reject ${x}`, () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
        return expect(main()).to.be.rejectedWith(`Version ${x} is not allowed. Use one of 0.0.0, 0.0.1, 0.1.0, 1.0.0.`);
      });
    });

    const nonSemVerFail = [
      'oops',
      '0',
      '0.1',
      '1.0',
      '1.2.3.4'
    ];

    nonSemVerFail.forEach((x) => {
      it(`should reject ${x}`, () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
        return expect(main()).to.be.rejectedWith(`Unsupported next version: ${x}`);
      });
    });

    it('should reject missing version argument', () => {
      process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
      return expect(main()).to.be.rejectedWith('Please specify the version with -v.');
    });
  });

  describe('when the current git version is not semver', () => {
    let git;
    beforeEach(() => {
      git = new Git(tempDirectory);
      git.init();
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
      git.add('hello.txt');
      git.commit('Adding hello.txt');
      git.tag('1.0');
    });

    it(
      'should fail',
      () => expect(main()).to.eventually.be.rejectedWith('Current git version 1.0 is not SemVer.')
    );
  });

  describe('when the current is commit is already versioned', () => {
    let git;
    beforeEach(() => {
      git = new Git(tempDirectory);
      git.init();
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
      git.add('hello.txt');
      git.commit('Adding hello.txt');
      git.tag('1.0.0');
    });

    it(
      'should fail',
      () => expect(main()).to.eventually.be.rejectedWith('The current commit is already tagged with versions 1.0.0.')
    );
  });

  describe('when a git version exists', () => {
    let git;
    beforeEach(async () => {
      git = new Git(tempDirectory);
      await git.initAsync();
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
      git.add('hello.txt');
      git.commit('Adding hello.txt');
      git.tag('1.0.0');
      fs.writeFileSync(inTemp('hello.txt'), 'hello, world again!', 'utf8');
      git.add('hello.txt');
      git.commit('Modifying hello.txt');
    });

    const happyFlows = [
      {
        argument: 'patch',
        expectedVersion: '1.0.1'
      },
      {
        argument: 'minor',
        expectedVersion: '1.1.0'
      },
      {
        argument: 'major',
        expectedVersion: '2.0.0'
      },
      '1.0.1',
      '1.1.0',
      '2.0.0'
    ];

    happyFlows.forEach((x) => {
      const argument = typeof x === 'string' ? x : x.argument;
      const expectedVersion = typeof x === 'string' ? x : x.expectedVersion;
      it(`should accept argument ${argument} and tag ${expectedVersion}`, async () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
        const currentSha = git.currentSha();
        await main();
        expect(git.latestVersion()).to.equal(expectedVersion);
        expect(git.currentSha()).to.equal(currentSha);
      });
    });

    const failFlows = [
      '0.0.0',
      '0.0.2',
      '0.2.0',
      '1.0.0',
      '1.0.2',
      '1.2.0'
    ];

    failFlows.forEach((x) => {
      it(`should reject ${x}`, () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
        return expect(main()).to.be.rejectedWith(`Version ${x} is not allowed. Use one of 1.0.1, 1.1.0, 2.0.0.`);
      });
    });

    const nonSemVerFail = [
      'oops',
      '2.0',
      '1',
      '1.2.3.4'
    ];

    nonSemVerFail.forEach((x) => {
      it(`should reject ${x}`, () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
        return expect(main()).to.be.rejectedWith(`Unsupported next version: ${x}`);
      });
    });

    it('should reject missing version argument', () => {
      process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
      return expect(main()).to.be.rejectedWith('Please specify the version with -v.');
    });

    it('should not tag on a different branch than master', () => {
      process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
      git.checkoutNew('develop');
      return expect(main()).to.be.rejectedWith('Only the master branch can be tagged.');
    });
  });

  describe('when pom.xml with version 0.0.1 is committed', () => {
    let git;
    beforeEach(async () => {
      git = new Git(tempDirectory);
      await git.initAsync();
      sourceDirectory = path.join(__dirname, '..', 'test', 'simple');
      copy('pom.xml');
      await updateXml(inTemp('pom.xml'), { project: { version: '0.0.1' } });
      git.add('pom.xml');
      git.commit('initial version');
    });

    describe('when no git version exists', () => {
      it('should tag current commit if no -v argument is given', async () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
        const currentSha = git.currentSha();
        await main();
        expect(git.latestVersion()).to.equal('0.0.1');
        expect(git.currentSha()).to.equal(currentSha);
      });

      const failFlows = [
        '0.0.1',
        '0.0.2',
        '0.2.0',
        'patch',
        'minor',
        'major'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x} because it does not match pom.xml`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(
            'No existing git tags found. Please skip the -v argument to tag the version defined in pom.xml.'
          );
        });
      });
    });

    describe('when current commit is versioned and matches pom.xml', () => {
      beforeEach(() => {
        git.tag('0.0.1');
      });

      const happyFlows = [
        {
          argument: 'patch',
          expectedVersion: '0.0.2'
        },
        {
          argument: 'minor',
          expectedVersion: '0.1.0'
        },
        {
          argument: 'major',
          expectedVersion: '1.0.0'
        },
        '0.0.2',
        '0.1.0',
        '1.0.0'
      ];

      happyFlows.forEach((x) => {
        const argument = typeof x === 'string' ? x : x.argument;
        const expectedVersion = typeof x === 'string' ? x : x.expectedVersion;
        it(`should accept argument ${argument} and tag ${expectedVersion}`, async () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
          const currentSha = git.currentSha();

          // act
          await main();

          // assert
          expect(git.latestVersion()).to.equal(expectedVersion);
          expect(git.currentSha()).to.not.equal(currentSha);
        });

        describe('on a different branch', () => {
          beforeEach(() => {
            git.checkoutNew('develop');
          });

          it(`should accept argument ${argument} and not tag`, async () => {
            // arrange
            process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
            const currentSha = git.currentSha();

            // act
            await main();

            // assert
            expect(git.latestVersion()).to.equal('0.0.1');
            expect(git.currentSha()).to.not.equal(currentSha);
          });
        });
      });

      const failFlows = [
        '0.0.0',
        '0.0.1',
        '0.0.3',
        '0.2.4',
        '0.3.0',
        '2.0.0'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x}`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(`Version ${x} is not allowed. Use one of 0.0.2, 0.1.0, 1.0.0.`);
        });
      });
    });
  });

  describe('when pom.xml with version 0.9.2 is committed', () => {
    let git;
    beforeEach(async () => {
      git = new Git(tempDirectory);
      await git.initAsync();
      sourceDirectory = path.join(__dirname, '..', 'test', 'simple');
      copy('pom.xml');
      await git.addAsync('pom.xml');
      await git.commitAsync('initial version');
    });

    describe('when no git version exists', () => {
      it('should fail when no -v argument is given', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
        return expect(main()).to.be.rejectedWith('Version 0.9.2 is not allowed. Use one of 0.0.0, 0.0.1, 0.1.0, 1.0.0.');
      });

      const failFlows = [
        '0.0.2',
        '0.2.0',
        'patch',
        'minor',
        'major'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x}`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(
            'No existing git tags found. Please skip the -v argument to tag the version defined in pom.xml.'
          );
        });
      });
    });

    describe('when current commit is versioned and matches pom.xml', () => {
      beforeEach(() => {
        git.tag('0.9.2');
      });

      const happyFlows = [
        {
          argument: 'patch',
          expectedVersion: '0.9.3'
        },
        {
          argument: 'minor',
          expectedVersion: '0.10.0'
        },
        {
          argument: 'major',
          expectedVersion: '1.0.0'
        },
        '0.9.3',
        '0.10.0',
        '1.0.0'
      ];

      happyFlows.forEach((x) => {
        const argument = typeof x === 'string' ? x : x.argument;
        const expectedVersion = typeof x === 'string' ? x : x.expectedVersion;
        it(`should accept argument ${argument} and tag ${expectedVersion}`, async () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
          const currentSha = git.currentSha();

          // act
          await main();

          // assert
          expect(git.latestVersion()).to.equal(expectedVersion);
          expect(git.currentSha()).to.not.equal(currentSha);
        });

        describe('on a different branch', () => {
          beforeEach(() => {
            git.checkoutNew('develop');
          });

          it(`should accept argument ${argument} and not tag`, async () => {
            // arrange
            process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
            const currentSha = git.currentSha();

            // act
            await main();

            // assert
            expect(git.latestVersion()).to.equal('0.9.2');
            expect(git.currentSha()).to.not.equal(currentSha);
          });
        });
      });

      const failFlows = [
        '0.0.0',
        '0.0.1',
        '0.9.2',
        '0.9.4',
        '0.10.4',
        '0.11.0',
        '2.0.0'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x}`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(`Version ${x} is not allowed. Use one of 0.9.3, 0.10.0, 1.0.0.`);
        });
      });
    });

    describe('when current commit is versioned and is behind pom.xml', () => {
      beforeEach(() => {
        git.tag('0.9.1');
      });

      it('should fail', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
        return expect(main()).to.be.rejectedWith(
          'Version cannot be specified when git tag (0.9.1) does not match pom.xml version (0.9.2).'
        );
      });
    });

    describe('when current commit is versioned and is ahead of pom.xml', () => {
      beforeEach(() => {
        git.tag('0.9.3');
      });

      it('should fail', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
        return expect(main()).to.be.rejectedWith(
          'Version cannot be specified when git tag (0.9.3) does not match pom.xml version (0.9.2).'
        );
      });
    });

    describe('when current commit is not versioned and last tag matches pom.xml', () => {
      beforeEach(async () => {
        // tag current commit
        git.tag('0.9.2');
        // add a dummy file
        fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
        await git.addAsync('hello.txt');
        await git.commitAsync('added hello file');
      });

      const happyFlows = [
        {
          argument: 'patch',
          expectedVersion: '0.9.3'
        },
        {
          argument: 'minor',
          expectedVersion: '0.10.0'
        },
        {
          argument: 'major',
          expectedVersion: '1.0.0'
        },
        '0.9.3',
        '0.10.0',
        '1.0.0'
      ];

      happyFlows.forEach((x) => {
        const argument = typeof x === 'string' ? x : x.argument;
        const expectedVersion = typeof x === 'string' ? x : x.expectedVersion;
        it(`should accept argument ${argument} and tag ${expectedVersion}`, async () => {
          // arrange
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', argument];
          const currentSha = git.currentSha();

          // act
          await main();

          // assert
          expect(git.latestVersion()).to.equal(expectedVersion);
          expect(git.currentSha()).to.not.equal(currentSha);
        });
      });

      const failFlows = [
        '0.0.0',
        '0.9.0',
        '0.9.2',
        '0.9.4',
        '0.10.4',
        '0.11.0',
        '2.0.0'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x}`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(`Version ${x} is not allowed. Use one of 0.9.3, 0.10.0, 1.0.0.`);
        });
      });

      it('should fail if -v is not specified', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
        return expect(main()).to.be.rejectedWith('Version 0.9.2 is not allowed. Use one of 0.9.3, 0.10.0, 1.0.0.');
      });
    });

    describe('when current commit is not versioned and last tag is behind pom.xml and a valid SemVer transition', () => {
      beforeEach(async () => {
        // tag current commit
        git.tag('0.9.1');
        // add a dummy file
        fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
        await git.addAsync('hello.txt');
        await git.commitAsync('added hello file');
      });

      it('should accept missing -v argument', async () => {
        // arrange
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push'];
        const currentSha = git.currentSha();

        // act
        await main();

        // assert
        expect(git.latestVersion()).to.equal('0.9.2');
        expect(git.currentSha()).to.equal(currentSha);
      });

      const failFlows = [
        '0.0.0',
        '0.9.0',
        '0.9.1',
        '0.9.2',
        '0.9.3',
        '0.9.4',
        '0.10.0',
        '1.0.0',
        'major',
        'minor',
        'patch'
      ];

      failFlows.forEach((x) => {
        it(`should reject ${x}`, () => {
          process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', x];
          return expect(main()).to.be.rejectedWith(
            'Version cannot be specified when git tag (0.9.1) does not match pom.xml version (0.9.2).'
          );
        });
      });
    });

    describe('when current commit is not versioned and last tag is behind pom.xml but not a valid SemVer transition', () => {
      beforeEach(() => {
        // tag current commit
        git.tag('0.9.0');
        // add a dummy file
        fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
        git.add('hello.txt');
        git.commit('added hello file');
      });

      it('should fail', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
        return expect(main()).to.be.rejectedWith('Version cannot be specified when git tag (0.9.0) does not match pom.xml version (0.9.2).');
      });
    });

    describe('when current commit is not versioned and last tag is ahead of pom.xml', () => {
      beforeEach(() => {
        // tag current commit
        git.tag('0.9.3');
        // add a dummy file
        fs.writeFileSync(inTemp('hello.txt'), 'hello, world!', 'utf8');
        git.add('hello.txt');
        git.commit('added hello file');
      });

      it('should fail', () => {
        process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
        return expect(main()).to.be.rejectedWith('Version cannot be specified when git tag (0.9.3) does not match pom.xml version (0.9.2).');
      });
    });
  });

  describe('pom edge cases', () => {
    let git;
    beforeEach(() => {
      git = new Git(tempDirectory);
      git.init();
      sourceDirectory = path.join(__dirname, '..', 'test', 'simple');
      process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'major'];
    });

    it('should not accept a pom without version', () => {
      // arrange
      copy('pom-no-version.xml', 'pom.xml');
      git.add('pom.xml');
      git.commit('initial version');

      // act
      return expect(main()).to.be.rejectedWith('Could not determine version of pom.xml.');
    });

    it('should not accept a pom that is not semver', () => {
      // arrange
      copy('pom-not-semver.xml', 'pom.xml');
      git.add('pom.xml');
      git.commit('initial version');

      // act
      return expect(main()).to.be.rejectedWith('Version 1.0 defined in pom.xml is not SemVer.');
    });
  });

  describe('multi module pom', () => {
    let git;
    beforeEach(async () => {
      git = new Git(tempDirectory);
      await git.initAsync();
    });

    it('should bump 3.12.0 to 3.13.0', async () => {
      // arrange
      sourceDirectory = path.join(__dirname, '..', 'test', 'multi-module');
      process.argv = ['node', 'main.js', '--dir', tempDirectory, '--no-push', '-v', 'minor'];
      copy('pom.xml');
      fs.mkdirSync(path.join(tempDirectory, 'bar-child-module'));
      fs.mkdirSync(path.join(tempDirectory, 'foo-child-module'));
      copy(path.join('bar-child-module', 'pom.xml'));
      copy(path.join('foo-child-module', 'pom.xml'));
      git.add('.');
      git.commit('initial version');
      git.tag('3.12.0');

      // act
      await main();

      // assert
      expect(path.join(tempDirectory, 'pom.xml')).to.have.sameContentsWith(path.join(sourceDirectory, 'pom-expected.xml'));
      expect(path.join(tempDirectory, 'bar-child-module', 'pom.xml')).to.have.sameContentsWith(path.join(sourceDirectory, 'bar-child-module', 'pom-expected.xml'));
      expect(path.join(tempDirectory, 'foo-child-module', 'pom.xml')).to.have.sameContentsWith(path.join(sourceDirectory, 'foo-child-module', 'pom-expected.xml'));
      expect(git.latestVersion()).to.equal('3.13.0');
      expect(await git.hasChanges()).to.be.false;
    });
  });
});
