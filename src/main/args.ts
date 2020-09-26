import { Command } from 'commander';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../../package.json');

export interface CLIArguments {
  source: string;
  v: string;
  dir: string;
  message?: string;
  dryRun: boolean;
  verbose: boolean;
  commit: boolean;
  push: boolean;
}

/**
 * Parses the command line options.
 * @returns {CLIArguments} The command line options.
 */
export function parse(): CLIArguments {
  const commander = new Command();

  // The name is needed for unit tests
  commander
    .name(name)
    .version(version)
    .option('-v <version>', `The new version to use. Must be semver and not leave gaps from previous version. It can also be one of major, minor, patch to automatically increment to the next version.`)
    .option('--dir [dir]', 'The directory to run the command in', '.')
    .option('--message [message]', 'An optional commit message')
    .option('--dry-run', 'Do not perform any changes, see what would happen')
    .option('--no-push', 'Do not push')
    .option('--verbose', 'Increase logging verbosity')
    .parse(process.argv);

  return commander as unknown as CLIArguments;
}
