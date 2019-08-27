const { Git } = require('./git');
const { DryRunGit } = require('./dry-run-git');

const createNormal = (dir) => new Git(dir);
const createDryRun = (dir) => new DryRunGit(dir);
let createGit = createNormal;

/**
 * Initializes the git module.
 * @param {boolean} dryRun If true, the git object will be read-only
 */
function initGit(dryRun) {
  createGit = dryRun ? createDryRun : createNormal;
}

module.exports = {
  createGit,
  initGit
};
