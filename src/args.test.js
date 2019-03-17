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

    it('should parse without any extra arguments', () => {
      // arrange
      process.argv = ['node', 'index.js'];

      // act
      const args = parse();

      // assert
      expect(args.V).to.be.undefined;
      expect(args.dir).to.eql('.');
      expect(args.message).to.be.undefined;
      expect(args.dryRun).to.be.undefined;
      expect(args.push).to.be.true;
      expect(args.verbose).to.be.undefined;
    });

    it('should parse dry-run', () => {
      // arrange
      process.argv = ['node', 'index.js', '--dry-run'];

      // act
      const args = parse();

      // assert
      expect(args.dryRun).to.be.true;
    });

    it('should parse verbose', () => {
      // arrange
      process.argv = ['node', 'index.js', '--verbose'];

      // act
      const args = parse();

      // assert
      expect(args.verbose).to.be.true;
    });

    it('should parse -v patch', () => {
      // arrange
      process.argv = ['node', 'index.js', '-v', 'patch'];

      // act
      const args = parse();

      // assert
      expect(args.V).to.equal('patch');
    });
  });
});
