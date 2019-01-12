/* eslint-disable global-require */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { expect } = require('chai');
const { initFs } = require('./fs-factory');

describe('fs-factory', () => {
  const testFile = path.join(os.tmpdir(), 'temp.txt');
  let originalFsWriteFileSync;

  beforeEach(() => {
    originalFsWriteFileSync = fs.writeFileSync;
  });

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }

    fs.writeFileSync = originalFsWriteFileSync;
  });

  it('should touch the fs', () => {
    // arrange

    // act
    initFs();

    // assert
    fs.writeFileSync(testFile, 'hello.txt', 'utf8');
    expect(fs.existsSync(testFile)).to.be.true;
  });

  it('should not touch the fs', () => {
    // arrange

    // act
    initFs(true);

    // assert
    fs.writeFileSync(testFile, 'hello.txt', 'utf8');
    expect(fs.existsSync(testFile)).to.be.false;
  });
});
