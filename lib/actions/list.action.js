const AbstractAction = require('./abstract.action');

class ListAction extends AbstractAction {
  // eslint-disable-next-line class-methods-use-this
  run(repository) {
    if (!this.firstTime) {
      this.firstTime = true;
      console.log([
        'Name', 'Language', 'Size', 'Pushed At',
      ].join('\t'));
    }

    console.log([
      repository.name,
      repository.language || '[Unknown]',
      repository.size,
      repository.pushed_at,
    ].join('\t'));
  }
}

module.exports = ListAction;
