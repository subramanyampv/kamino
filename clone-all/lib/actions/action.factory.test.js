const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');

describe('action.factory', () => {
  let actionFactory;
  let optionsParser;
  let ListAction;
  let CloneAction;

  beforeEach(() => {
    ListAction = sinon.stub();
    CloneAction = sinon.stub();
    // eslint-disable-next-line global-require
    optionsParser = sinon.stub(require('../options_parser'));
    actionFactory = proxyquire('./action.factory', {
      './list.action': ListAction,
      './clone.action': CloneAction,
      '../options_parser': optionsParser,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create list action', () => {
    // arrange
    const options = {
      provider: 'github',
      list: true,
    };
    optionsParser.get.returns(options);

    // act
    const action = actionFactory();

    // assert
    expect(ListAction).calledWithNew;
    expect(action).instanceOf(ListAction);
  });

  it('should create clone action', () => {
    // arrange
    const options = {
      provider: 'github',
    };
    optionsParser.get.returns(options);

    // act
    const action = actionFactory(options);

    // assert
    expect(CloneAction).calledWithNew;
    expect(action).instanceOf(CloneAction);
  });
});
