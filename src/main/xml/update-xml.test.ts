const rimraf = require('rimraf').sync;
import fs = require('fs');
import os = require('os');
import path = require('path');
import chai = require('chai');
import { PomDom } from '../pom/get-pom-version';
import { dom } from './dom';
import { updateXml } from './update-xml';

const { expect } = chai;

describe('update-xml', () => {
  let tmpdir;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'yart'));
  });

  afterEach(() => rimraf(tmpdir));

  it('should update project version', async () => {
    const testPath = path.join(__dirname, '..', '..', 'test', 'fixtures');
    const sourceFilename = path.join(testPath, 'simple', 'pom.xml');
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const originalContents = (await dom(filename)) as PomDom;
    expect(originalContents.project.version).to.equal('0.9.2');
    await updateXml(fs, filename, {
      project: {
        version: '0.9.3'
      }
    });
    const newContents = (await dom(filename)) as PomDom;
    expect(newContents.project.version).to.equal('0.9.3');
    newContents.project.version = '0.9.2';
    expect(originalContents).to.eql(newContents);
  });

  it('should update project parent version', async () => {
    const testPath = path.join(__dirname, '..', '..', 'test', 'fixtures');
    const sourceFilename = path.join(
      testPath,
      'multi-module',
      'bar-child-module',
      'pom.xml'
    );
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const originalContents = (await dom(filename)) as PomDom;
    expect(originalContents.project.parent.version).to.equal('3.12.0');
    await updateXml(fs, filename, {
      project: {
        parent: {
          version: '4.0.0'
        }
      }
    });
    const newContents = (await dom(filename)) as PomDom;
    expect(newContents.project.parent.version).to.equal('4.0.0');
    newContents.project.parent.version = '3.12.0';
    expect(originalContents).to.eql(newContents);
  });

  function modificationTime(filename): number {
    return fs.statSync(filename).mtimeMs;
  }

  it('should not write file if no changes have occurred', async () => {
    const testPath = path.join(__dirname, '..', '..', 'test', 'fixtures');
    const sourceFilename = path.join(testPath, 'simple', 'pom.xml');
    const filename = path.join(tmpdir, 'pom.xml');
    fs.copyFileSync(sourceFilename, filename);
    const oldModificationTime = modificationTime(filename);
    const originalContents = (await dom(filename)) as PomDom;
    expect(originalContents.project.version).to.equal('0.9.2');
    await updateXml(fs, filename, {
      project: {
        version: '0.9.2'
      }
    });
    const newContents = await dom(filename);
    expect(originalContents).to.eql(newContents);
    expect(modificationTime(filename)).to.equal(oldModificationTime);
  });
});
