const logger = require('@ngeor/js-cli-logger');
const AbstractAction = require('./abstract.action');

class ListAction extends AbstractAction {
  // eslint-disable-next-line class-methods-use-this
  run(repository) {
    if (!this.firstTime) {
      this.firstTime = true;
      logger.log([
        'Name', 'Language', 'Size', 'Pushed At',
      ].join('\t'));
    }

    logger.log([
      repository.name,
      repository.language || '[Unknown]',
      repository.size,
      repository.pushed_at,
    ].join('\t'));
  }
}

module.exports = ListAction;
