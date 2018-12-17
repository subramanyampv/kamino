const sinon = require('sinon');
const { expect } = require('chai');
const ListAction = require('./list.action');

describe('list.action', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.spy(console, 'log');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should print the repository details', () => {
    // arrange
    const listAction = new ListAction({});

    // act
    listAction.run({
      name: 'clone-all',
      language: 'JavaScript',
      size: '1GB',
      pushed_at: 'yesterday',
    });

    // assert
    expect(console.log).calledWith('Name\tLanguage\tSize\tPushed At');
    expect(console.log).calledWith('clone-all\tJavaScript\t1GB\tyesterday');
    expect(console.log).calledTwice;
  });

  it('should print the header column only once', () => {
    // arrange
    const listAction = new ListAction({});

    // act
    listAction.run({
      name: 'clone-all',
      language: 'JavaScript',
      size: '1GB',
      pushed_at: 'yesterday',
    });

    listAction.run({
      name: 'other-repo',
      size: '2GB',
      pushed_at: 'today',
    });

    // assert
    expect(console.log).calledWith('Name\tLanguage\tSize\tPushed At');
    expect(console.log).calledWith('clone-all\tJavaScript\t1GB\tyesterday');
    expect(console.log).calledWith('other-repo\t[Unknown]\t2GB\ttoday');
    expect(console.log).calledThrice;
  });
});
