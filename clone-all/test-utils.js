const { expect } = require('chai');

module.exports = {
  /**
     * Expect an error from an async function.
     * @param {function} fn - The async function.
     * @param {string} msg - The expected message.
     */
  expectAsyncError: async function expectAsyncError(fn, msg) {
    let error = null;
    try {
      await fn();
    } catch (e) {
      error = e;
    }

    expect(() => {
      throw error;
    }).to.throw(msg);
  },
};
