const assert = require('assert');

describe('homepage', () => {
  it('should have the correct title', () => {
    browser.url('/');
    const title = browser.getTitle();
    assert.equal(title, 'blog-helm');
  });
});
