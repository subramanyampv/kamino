var process = require('process');

function getBooleanOption(option) {
    return process.argv.indexOf(option) >= 0;
}

function getStringOption(optionPrefix, defaultValue) {
    var argv = process.argv;
    for (var i = 0; i < argv.length; i++) {
        var arg = argv[i];
        if (arg.indexOf(optionPrefix) === 0) {
            return arg.substring(optionPrefix.length);
        }
    }

    return defaultValue || '';
}

function getStringOptionWithEnvironmentVariableFallback(optionName) {
    var result = getStringOption('--' + optionName + '=');
    if (result) {
        return result;
    }

    var envVariableName = 'CLONE_ALL_' + optionName.toUpperCase();
    return process.env[envVariableName] || '';
}

module.exports = {
    isDryRun: function() {
        return getBooleanOption('--dry-run');
    },

    isVerbose: function() {
        return getBooleanOption('-v');
    },

    isNoPagination: function() {
        return getBooleanOption('--no-pagination');
    },

    /**
     * Gets the repository provider.
     * @returns {string} The name of the repository provider.
     */
    getProvider: function() {
        return getStringOption('--provider=');
    },

    getOwnerUsername: function() {
        return getStringOptionWithEnvironmentVariableFallback('owner');
    },

    getUsername: function() {
        return getStringOptionWithEnvironmentVariableFallback('username');
    },

    getPassword: function() {
        return getStringOptionWithEnvironmentVariableFallback('password');
    },

    getOutputDirectory: function() {
        return getStringOption('--output=');
    },

    getBundleDirectory: function() {
        return getStringOption('--bundle-dir=');
    },

    getProtocol: function() {
        return getStringOption('--protocol=', 'ssh');
    },

    getSSHUsername: function() {
        return getStringOption('--ssh-username=');
    }
};
