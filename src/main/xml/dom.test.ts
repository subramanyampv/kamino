import path = require('path');
import chai = require('chai');
import { PomDom } from '../pom/get-pom-version';
import { dom } from './dom';

const { expect } = chai;

describe('dom', () => {
  const fixturesPath = path.join(__dirname, '..', '..', 'test', 'fixtures');

  function pomPath(...args: string[]): string {
    let array = [fixturesPath];
    array = array.concat(args);
    array.push('pom.xml');
    return path.join(...array);
  }

  it('should read project version', async () => {
    const filename = pomPath('simple');
    const result = (await dom(filename)) as PomDom;
    expect(result.project.version).to.equal('0.9.2');
  });

  it('should read modules', async () => {
    const filename = pomPath('multi-module');
    const result = (await dom(filename)) as PomDom;
    expect(result.project.modules.module).to.have.members([
      'bar-child-module',
      'foo-child-module'
    ]);
  });

  it('should read parent pom version', async () => {
    const filename = pomPath('multi-module', 'bar-child-module');
    const result = (await dom(filename)) as PomDom;
    expect(result.project.parent.version).to.equal('3.12.0');
  });
});
