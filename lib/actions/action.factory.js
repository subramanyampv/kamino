const ListAction = require('./list.action');
const CloneAction = require('./clone.action');
const Git = require('../git');
const execFactory = require('../exec.factory');

class ActionFactory {
  /**
   * Creates a new action based on the CLI options.
   * @param {*} options The CLI options.
   */
  // eslint-disable-next-line class-methods-use-this
  create(options) {
    if (options.list) {
      return new ListAction(options);
    }

    const execAsync = execFactory(options);
    const git = new Git(execAsync);
    return new CloneAction(options, git);
  }
}

module.exports = ActionFactory;
