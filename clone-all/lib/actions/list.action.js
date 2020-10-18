const logger = require('@ngeor/js-cli-logger');

class ListAction {
  constructor() {
    this.firstTime = true;
  }

  run(repository) {
    if (this.firstTime) {
      this.firstTime = false;
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
