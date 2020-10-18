import fs = require('fs');

function stubWriteFileSync(path): void {
  console.log(`Would have written path ${path}`);
}

export function initFs(dryRun): typeof fs {
  if (dryRun) {
    return {
      ...fs,
      writeFileSync: stubWriteFileSync
    };
  }

  return fs;
}
