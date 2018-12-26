const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { expect } = require('chai');
const hasFileFilter = require('./has-file.filter');

describe('has-file.filter', () => {
  beforeEach(() => {
    sinon.stub(fs, 'existsSync');
    sinon.stub(path, 'resolve');

    path.resolve.withArgs('/c', 'tmp', 'pom.xml').returns('/c/tmp/pom.xml');
  });

  afterEach(() => sinon.restore());

  it('should match when null hasFile is given', () => {
    expect(hasFileFilter({ name: 'tmp' }, { hasFile: null })).to.be.true;
  });

  it('should match when the directory has the requested file', () => {
    fs.existsSync.withArgs('/c/tmp/pom.xml').returns(true);
    expect(hasFileFilter({ name: 'tmp' }, { dir: '/c', hasFile: 'pom.xml' })).to.be.true;
  });

  it('should not match when the directory does not have the requested file', () => {
    fs.existsSync.withArgs('/c/tmp/pom.xml').returns(false);
    expect(hasFileFilter({ name: 'tmp' }, { dir: '/c', hasFile: 'pom.xml' })).to.be.false;
  });
});
