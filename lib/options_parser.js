const process = require('process');
const Command = require('commander').Command;

let _options = null;

module.exports = {
    parse: function parse() {
        const commander = new Command();
        commander
            .name(require('../package.json').name) // needed for unit tests
            .version(require('../package.json').version)
            .option('-p, --provider <provider>', 'The git provider (github, bitbucket_cloud)', /^(github|bitbucket_cloud)$/)
            .option('--owner [owner]', 'The owner of the git repository (for bitbucket cloud)')
            .option('--username <username>', 'The username of the git repository')
            .option('--password [password]', 'The password for Bitbucket basic authentication')
            .option('--output <path>', 'The path where repositories should be cloned into')
            .option('--bundle-dir [path]', 'The path where git bundles should be created in')
            .option('--protocol [protocol]', 'The git protocol (ssh or https)', /^(https|ssh)$/, 'ssh')
            .option('--ssh-username [ssh-username]', 'The username for SSH protocol')
            .option('--dry-run', 'Do not perform any changes')
            .option('-v, --verbose', 'Increase logging verbosity')
            .option('--no-pagination', 'Fetch only one page of repositories')
            .option('--no-forks', 'Do not fetch forked repositories')
            .parse(process.argv);

        const defaults = {
            verbose: false,
            dryRun: false,
            sshUsername: '',
            owner: '',
            username: '',
            password: '',
            bundleDir: '',
            output: '',
            provider: ''
        };

        for (const key in defaults) {
            commander[key] = commander[key] || defaults[key];
        }

        if (!commander.provider || !commander.username) {
            console.log('Error: mandatory parameters are missing.');
            commander.outputHelp();
            process.exit(1);
        }

        if (commander.verbose) {
            for (const key in defaults) {
                console.log(`${key}: ${commander[key]}`);
            }
        }

        _options = commander;

        return commander;
    },

    get: function get() {
        return _options;
    }
};
