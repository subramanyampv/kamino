var options = require('./options');

function getRepositories() {
    var provider = require('./providers/' + options.getProvider());
    return provider.getRepositories();
}

module.exports = {
    getRepositories: getRepositories
};
