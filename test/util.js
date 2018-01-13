const chai = require('chai');
const expect = chai.expect;

module.exports = {
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
    }
};
