/**
 * Base class for actions.
 * All actions need to implement a `run` method which accepts a repository object.
 */
class AbstractAction {
  constructor(options) {
    this.options = options;
  }
}

module.exports = AbstractAction;
