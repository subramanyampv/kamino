const { expect } = require('chai');
const dirPrefixFilter = require('./dir-prefix.filter');

describe('dir-prefix.filter', () => {
  it('should match when null dirPrefix is given', () => {
    expect(dirPrefixFilter({ name: 'tmp' }, { dirPrefix: null })).to.be.true;
  });

  it('should match when an empty dirPrefix filter is given', () => {
    expect(dirPrefixFilter({ name: 'tmp' }, { dirPrefix: [] })).to.be.true;
  });

  it('should match when the filename starts with one of the prefixes', () => {
    expect(dirPrefixFilter({ name: 'tmp' }, { dirPrefix: ['t', 'z'] })).to.be.true;
  });

  it('should not match when the filename does not start with any of the prefixes', () => {
    expect(dirPrefixFilter({ name: 'tmp' }, { dirPrefix: ['x', 'z'] })).to.be.false;
  });
});
