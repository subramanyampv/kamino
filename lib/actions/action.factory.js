const ListAction = require('./list.action');
const CloneAction = require('./clone.action');
const optionsParser = require('../options_parser');

function createAction() {
  const options = optionsParser.get();
  if (options.list) {
    return new ListAction();
  }

  return new CloneAction();
}

module.exports = createAction;
