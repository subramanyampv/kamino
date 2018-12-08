/** @module lib/list_all_repos */

/**
 * Prints information for all repositories.
 * @param {array} repositories - The repositories to print information for.
 */
module.exports = function listAllRepos(repositories) {
  console.log([
    'Name', 'Language', 'Size', 'Pushed At',
  ].join('\t'));
  repositories.forEach((repo) => {
    console.log([
      repo.name,
      repo.language || '[Unknown]',
      repo.size,
      repo.pushed_at,
    ].join('\t'));
  });
};
