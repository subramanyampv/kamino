const assert = require('assert');

describe('homepage', () => {
  it('should have the correct title', async () => {
    await browser.url('/');
    const title = await browser.getTitle();
    assert.equal(title, 'blog-helm');
  });
});
