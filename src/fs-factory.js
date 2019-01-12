const fs = require('fs');

function stubWriteFileSync(path) {
  // eslint-disable-next-line no-console
  console.log(`Would have written path ${path}`);
}

function initFs(dryRun) {
  if (dryRun) {
    fs.writeFileSync = stubWriteFileSync;
  }
}

module.exports = {
  initFs,
};
