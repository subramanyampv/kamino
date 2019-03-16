const { expect } = require('chai');
const { parse } = require('./args');

describe('args', () => {
  describe('parse', () => {
    let oldArgv;

    beforeEach(() => {
      oldArgv = process.argv;
    });

    afterEach(() => {
      process.argv = oldArgv;
    });

    it('should parse', () => {
      // arrange
      process.argv = ['node', 'index.js'];

      // act
      const args = parse();

      // assert
      expect(args.v).to.be.undefined;
      expect(args.source).to.eql('git');
      expect(args.dir).to.eql('.');
      expect(args.message).to.be.undefined;
      expect(args.dryRun).to.be.undefined;
      expect(args.commit).to.be.true;
      expect(args.push).to.be.true;
      expect(args.verbose).to.be.undefined;
    });
  });
});
