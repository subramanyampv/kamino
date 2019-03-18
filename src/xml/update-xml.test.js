const fs = require('fs');
const os = require('os');
const path = require('path');
const chai = require('chai');
const dom = require('./dom');
const updateXml = require('./update-xml');

const { expect } = chai;

describe('update-xml', () => {
  it('should update project version', async () => {
    const sourceFilename = path.join(__dirname, '..', '..', 'test', 'simple', 'pom.xml');
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const originalContents = await dom(filename);
    expect(originalContents.project.version).to.equal('0.9.2');
    await updateXml(filename, {
      project: {
        version: '0.9.3'
      }
    });
    const newContents = await dom(filename);
    expect(newContents.project.version).to.equal('0.9.3');
    newContents.project.version = '0.9.2';
    expect(originalContents).to.eql(newContents);
  });

  it('should update project parent version', async () => {
    const sourceFilename = path.join(__dirname, '..', '..', 'test', 'multi-module', 'bar-child-module', 'pom.xml');
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const originalContents = await dom(filename);
    expect(originalContents.project.parent.version).to.equal('3.12.0');
    await updateXml(filename, {
      project: {
        parent: {
          version: '4.0.0'
        }
      }
    });
    const newContents = await dom(filename);
    expect(newContents.project.parent.version).to.equal('4.0.0');
    newContents.project.parent.version = '3.12.0';
    expect(originalContents).to.eql(newContents);
  });

  it('should not write file if no changes have occurred', async () => {
    const sourceFilename = path.join(__dirname, '..', '..', 'test', 'simple', 'pom.xml');
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const oldModificationTime = fs.statSync(filename).mtimeMs;
    const originalContents = await dom(filename);
    expect(originalContents.project.version).to.equal('0.9.2');
    await updateXml(filename, {
      project: {
        version: '0.9.2'
      }
    });
    const newContents = await dom(filename);
    expect(originalContents).to.eql(newContents);
    const newModificationTime = fs.statSync(filename).mtimeMs;
    expect(newModificationTime).to.equal(oldModificationTime);
  });
});
