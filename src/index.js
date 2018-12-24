function log(message) {
  // eslint-disable-next-line no-console
  console.log(message);
}

let verboseEnabled = false;

function isVerboseEnabled() {
  return verboseEnabled;
}

function setVerboseEnabled(enabled) {
  verboseEnabled = enabled;
}

function verbose(message) {
  if (isVerboseEnabled()) {
    log(message);
  }
}

function info(message) {
  log(message);
}

module.exports = {
  log,
  isVerboseEnabled,
  setVerboseEnabled,
  verbose,
  info,
};
