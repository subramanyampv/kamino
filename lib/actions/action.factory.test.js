const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');

describe('action.factory', () => {
  let actionFactory;

  class MockGit {
    constructor(execAsync) {
      this.execAsync = execAsync;
    }
  }

  function mockExecFactory(options) {
    return {
      ...options,
      execFactory: true,
    };
  }

  beforeEach(() => {
    function actionClass(id) {
      return class {
        constructor(...args) {
          this.args = args;
          this.id = id;
        }
      };
    }

    const ActionFactoryClass = proxyquire('./action.factory', {
      './list.action': actionClass('list'),
      './clone.action': actionClass('clone'),
      '../git': MockGit,
      '../exec.factory': mockExecFactory,
    });

    actionFactory = new ActionFactoryClass();
  });

  it('should create list action', () => {
    // arrange
    const options = {
      provider: 'github',
      list: true,
    };

    // act
    const action = actionFactory.create(options);

    // assert
    expect(action.id).to.eql('list');
    expect(action.args).to.eql([options]);
  });

  it('should create clone action', () => {
    // arrange
    const options = {
      provider: 'github',
    };

    // act
    const action = actionFactory.create(options);

    // assert
    expect(action.id).to.eql('clone');
    expect(action.args).to.eql([options, new MockGit({ provider: 'github', execFactory: true })]);
  });
});
