const logger = require('@ngeor/js-cli-logger');
const optionsParser = require('../options_parser');
const httpsPromise = require('../https_promise');

function repositoryFilter(repository, options) {
  return (!repository.fork || options.forks) && (!repository.archived || options.archived);
}

/**
 * Gets the URL of the next page.
 * This is found in the header Link.
 * Link: <https://api.github.com/user/repos?page=3&per_page=100>; rel="next", <https://api.github.com/user/repos?page=50&per_page=100>; rel="last"
 */
function getNextUrl(headers) {
  const { link } = headers;
  if (!link) {
    return null;
  }

  const r = /<([^>]+)>; rel="next"/;
  const match = r.exec(link);
  if (!match) {
    return null;
  }

  return match[1];
}

/**
 * For GitHub, it simply returns the repositories as-is.
 * Interesting properties: name, clone_url, ssh_url.
 * @param {object} options - The command line options.
 * @returns {object} The parsed JSON response.
 * @example
 * {
 * "id": 26048638,
 * "name": "clone-all",
 * "full_name": "ngeor/clone-all",
 * "owner": {
 * "login": "ngeor",
 * "id": 461097,
 * "avatar_url": "https://avatars1.githubusercontent.com/u/461097?v=4",
 * "gravatar_id": "",
 * "url": "https://api.github.com/users/ngeor",
 * "html_url": "https://github.com/ngeor",
 * "followers_url": "https://api.github.com/users/ngeor/followers",
 * "following_url": "https://api.github.com/users/ngeor/following{/other_user}",
 * "gists_url": "https://api.github.com/users/ngeor/gists{/gist_id}",
 * "starred_url": "https://api.github.com/users/ngeor/starred{/owner}{/repo}",
 * "subscriptions_url": "https://api.github.com/users/ngeor/subscriptions",
 * "organizations_url": "https://api.github.com/users/ngeor/orgs",
 * "repos_url": "https://api.github.com/users/ngeor/repos",
 * "events_url": "https://api.github.com/users/ngeor/events{/privacy}",
 * "received_events_url": "https://api.github.com/users/ngeor/received_events",
 * "type": "User",
 * "site_admin": false
 * },
 * "private": false,
 * "html_url": "https://github.com/ngeor/clone-all",
 * "description": "Automatically clone all your github repositories.",
 * "fork": false,
 * "url": "https://api.github.com/repos/ngeor/clone-all",
 * "forks_url": "https://api.github.com/repos/ngeor/clone-all/forks",
 * "keys_url": "https://api.github.com/repos/ngeor/clone-all/keys{/key_id}",
 * "collaborators_url": "https://api.github.com/repos/ngeor/clone-all/collaborators{/collaborator}",
 * "teams_url": "https://api.github.com/repos/ngeor/clone-all/teams",
 * "hooks_url": "https://api.github.com/repos/ngeor/clone-all/hooks",
 * "issue_events_url": "https://api.github.com/repos/ngeor/clone-all/issues/events{/number}",
 * "events_url": "https://api.github.com/repos/ngeor/clone-all/events",
 * "assignees_url": "https://api.github.com/repos/ngeor/clone-all/assignees{/user}",
 * "branches_url": "https://api.github.com/repos/ngeor/clone-all/branches{/branch}",
 * "tags_url": "https://api.github.com/repos/ngeor/clone-all/tags",
 * "blobs_url": "https://api.github.com/repos/ngeor/clone-all/git/blobs{/sha}",
 * "git_tags_url": "https://api.github.com/repos/ngeor/clone-all/git/tags{/sha}",
 * "git_refs_url": "https://api.github.com/repos/ngeor/clone-all/git/refs{/sha}",
 * "trees_url": "https://api.github.com/repos/ngeor/clone-all/git/trees{/sha}",
 * "statuses_url": "https://api.github.com/repos/ngeor/clone-all/statuses/{sha}",
 * "languages_url": "https://api.github.com/repos/ngeor/clone-all/languages",
 * "stargazers_url": "https://api.github.com/repos/ngeor/clone-all/stargazers",
 * "contributors_url": "https://api.github.com/repos/ngeor/clone-all/contributors",
 * "subscribers_url": "https://api.github.com/repos/ngeor/clone-all/subscribers",
 * "subscription_url": "https://api.github.com/repos/ngeor/clone-all/subscription",
 * "commits_url": "https://api.github.com/repos/ngeor/clone-all/commits{/sha}",
 * "git_commits_url": "https://api.github.com/repos/ngeor/clone-all/git/commits{/sha}",
 * "comments_url": "https://api.github.com/repos/ngeor/clone-all/comments{/number}",
 * "issue_comment_url": "https://api.github.com/repos/ngeor/clone-all/issues/comments{/number}",
 * "contents_url": "https://api.github.com/repos/ngeor/clone-all/contents/{+path}",
 * "compare_url": "https://api.github.com/repos/ngeor/clone-all/compare/{base}...{head}",
 * "merges_url": "https://api.github.com/repos/ngeor/clone-all/merges",
 * "archive_url": "https://api.github.com/repos/ngeor/clone-all/{archive_format}{/ref}",
 * "downloads_url": "https://api.github.com/repos/ngeor/clone-all/downloads",
 * "issues_url": "https://api.github.com/repos/ngeor/clone-all/issues{/number}",
 * "pulls_url": "https://api.github.com/repos/ngeor/clone-all/pulls{/number}",
 * "milestones_url": "https://api.github.com/repos/ngeor/clone-all/milestones{/number}",
 * "notifications_url": "https://api.github.com/repos/ngeor/clone-all/notifications{?since,all,participating}",
 * "labels_url": "https://api.github.com/repos/ngeor/clone-all/labels{/name}",
 * "releases_url": "https://api.github.com/repos/ngeor/clone-all/releases{/id}",
 * "deployments_url": "https://api.github.com/repos/ngeor/clone-all/deployments",
 * "created_at": "2014-11-01T11:14:24Z",
 * "updated_at": "2017-10-30T22:26:10Z",
 * "pushed_at": "2018-01-23T08:22:42Z",
 * "git_url": "git://github.com/ngeor/clone-all.git",
 * "ssh_url": "git@github.com:ngeor/clone-all.git",
 * "clone_url": "https://github.com/ngeor/clone-all.git",
 * "svn_url": "https://github.com/ngeor/clone-all",
 * "homepage": null,
 * "size": 206,
 * "stargazers_count": 1,
 * "watchers_count": 1,
 * "language": "JavaScript",
 * "has_issues": true,
 * "has_projects": true,
 * "has_downloads": true,
 * "has_wiki": true,
 * "has_pages": false,
 * "forks_count": 1,
 * "mirror_url": null,
 * "archived": false,
 * "open_issues_count": 0,
 * "license": {
 * "key": "mit",
 * "name": "MIT License",
 * "spdx_id": "MIT",
 * "url": "https://api.github.com/licenses/mit"
 * },
 * "forks": 1,
 * "open_issues": 0,
 * "watchers": 1,
 * "default_branch": "master"
 * }
 */
async function getRepositories() {
  const options = optionsParser.get();
  const requestOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'clone-all.js',
    },
  };

  let url = `https://api.github.com/users/${options.username}/repos`;
  let repositories = [];

  while (url) {
    logger.log(`Fetching repository info ${url}`);
    // eslint-disable-next-line no-await-in-loop
    const { headers, message } = await httpsPromise.request(url, requestOptions);
    const response = JSON.parse(message);
    const pageRepositories = response.filter((r) => repositoryFilter(r, options));
    repositories = repositories.concat(pageRepositories);
    url = getNextUrl(headers);
  }

  return repositories;
}

module.exports = {
  getRepositories,
};
