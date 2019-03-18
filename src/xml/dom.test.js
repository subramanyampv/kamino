const path = require('path');
const chai = require('chai');
const dom = require('./dom');

const { expect } = chai;

describe('dom', () => {
  it('should read project version', async () => {
    const filename = path.join(__dirname, '..', '..', 'test', 'simple', 'pom.xml');
    const result = await dom(filename);
    expect(result.project.version).to.equal('0.9.2');
  });

  it('should read modules', async () => {
    const filename = path.join(__dirname, '..', '..', 'test', 'multi-module', 'pom.xml');
    const result = await dom(filename);
    expect(result.project.modules.module).to.have.members([
      'bar-child-module',
      'foo-child-module'
    ]);
  });

  it('should read parent pom version', async () => {
    const filename = path.join(__dirname, '..', '..', 'test', 'multi-module', 'bar-child-module', 'pom.xml');
    const result = await dom(filename);
    expect(result.project.parent.version).to.equal('3.12.0');
  });
});
