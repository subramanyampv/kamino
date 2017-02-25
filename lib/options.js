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

    getUsername: function() {
        return getStringOption('--username=');
    },

    getOutputDirectory: function() {
        return getStringOption('--output=');
    },

    getProtocol: function() {
        return getStringOption('--protocol=', 'ssh');
    },

    getSSHUsername: function() {
        return getStringOption('--ssh-username=');
    }
};
