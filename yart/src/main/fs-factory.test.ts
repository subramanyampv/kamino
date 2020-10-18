import fs = require('fs');
import os = require('os');
import path = require('path');
import { expect } from 'chai';
import { initFs } from './fs-factory';

describe('fs-factory', () => {
  const testFile = path.join(os.tmpdir(), 'temp.txt');

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should touch the fs', () => {
    // Act
    initFs(false).writeFileSync(testFile, 'hello.txt', 'utf8');

    // Assert
    expect(fs.existsSync(testFile)).to.be.true;
  });

  it('should not touch the fs', () => {
    // Act
    initFs(true).writeFileSync(testFile, 'hello.txt', 'utf8');

    // Assert
    expect(fs.existsSync(testFile)).to.be.false;
  });
});
