import { expect } from 'chai';
import { parse } from './args';

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
      // Arrange
      process.argv = [
        'node',
        'index.js'
      ];

      // Act
      const args = parse();

      // Assert
      expect(args.V).to.be.undefined;
      expect(args.dir).to.equal('.');
      expect(args.message).to.be.undefined;
      expect(args.dryRun).to.be.undefined;
      expect(args.push).to.be.true;
      expect(args.verbose).to.be.undefined;
    });

    it('should parse dry-run', () => {
      // Arrange
      process.argv = [
        'node',
        'index.js',
        '--dry-run'
      ];

      // Act
      const args = parse();

      // Assert
      expect(args.dryRun).to.be.true;
    });

    it('should parse verbose', () => {
      // Arrange
      process.argv = [
        'node',
        'index.js',
        '--verbose'
      ];

      // Act
      const args = parse();

      // Assert
      expect(args.verbose).to.be.true;
    });

    it('should parse -v patch', () => {
      // Arrange
      process.argv = [
        'node',
        'index.js',
        '-v',
        'patch'
      ];

      // Act
      const args = parse();

      // Assert
      expect(args.V).to.equal('patch');
    });
  });
});
