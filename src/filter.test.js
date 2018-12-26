const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
chai.use(require('sinon-chai'));

const filters = [
  'dir-prefix',
  'has-file',
  'has-json',
  'eval-js',
];

const filterIncludes = filters.map(f => `./filters/${f}.filter`);

describe('filter', () => {
  const file = {};
  const cliArgs = {};
  let filter;
  let stubs;

  function makeStubFilter(name) {
    const result = {};
    result[name] = sinon.stub();
    return result;
  }

  beforeEach(() => {
    file.name = 'tmp';
    file.isDirectory = sinon.stub();
    cliArgs.dir = '/c';

    stubs = Object.assign(
      {},
      ...filterIncludes.map(f => makeStubFilter(f)),
    );

    filter = proxyquire('./filter', stubs);
  });

  afterEach(() => sinon.restore());

  describe('when it is not a directory', () => {
    beforeEach(() => {
      file.isDirectory.returns(false);
    });

    it('should not match', () => {
      expect(filter.isMatchingDir(file, cliArgs)).to.be.false;
    });

    filterIncludes.forEach((f) => {
      it(`should not call filter ${f}`, () => {
        // act
        filter.isMatchingDir(file, cliArgs);

        // assert
        expect(stubs[f]).not.called;
      });
    });
  });

  describe('when it is a directory', () => {
    beforeEach(() => {
      file.isDirectory.returns(true);
    });

    describe('when all filters return false', () => {
      beforeEach(() => {
        // eslint-disable-next-line no-unused-vars
        Object.entries(stubs).forEach(([_, stub]) => stub.withArgs(file, cliArgs).returns(false));
      });

      it('should not match', () => {
        expect(filter.isMatchingDir(file, cliArgs)).to.be.false;
      });
    });

    describe('when all filters return true', () => {
      beforeEach(() => {
        // eslint-disable-next-line no-unused-vars
        Object.entries(stubs).forEach(([_, stub]) => stub.withArgs(file, cliArgs).returns(true));
      });

      it('should match', () => {
        expect(filter.isMatchingDir(file, cliArgs)).to.be.true;
      });
    });

    filterIncludes.forEach((f) => {
      describe(`when all filters return true except ${f}`, () => {
        beforeEach(() => {
          Object.entries(stubs)
            .forEach(([key, stub]) => stub.withArgs(file, cliArgs).returns(key !== f));
        });

        it('should not match', () => {
          expect(filter.isMatchingDir(file, cliArgs)).to.be.false;
        });
      });
    });
  });
});
