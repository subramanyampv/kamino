const { expect } = require('chai');
const add = require('./index');

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).to.eql(3);
  });
});
