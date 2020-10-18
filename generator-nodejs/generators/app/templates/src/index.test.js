<% if (testFramework === 'mocha') { _%>
const { expect } = require('chai');
<%_ } _%>
const add = require('./index');

describe('add', () => {
  it('should add two numbers', () => {
<%_ if (testFramework === 'mocha') { _%>
    expect(add(1, 2)).to.eql(3);
<%_ } else if (testFramework === 'jest') { _%>
    expect(add(1, 2)).toBe(3);
<%_ } _%>
  });
});
