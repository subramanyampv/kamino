// check if package.json and package-lock.json version are aligned
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
const packageLockJson = JSON.parse(fs.readFileSync('package-lock.json', { encoding: 'utf8' }));
if (packageJson.version !== packageLockJson.version) {
  throw new Error(`package.json and package-lock.json version mismatch: ${packageJson.version} vs ${packageLockJson.version}`);
}

console.log(`package.json and package-lock.json versions are aligned ${packageJson.version}`);

// could be something like 3.0.1-fix-ssh.38
const buildNumber = process.argv[2];
if (!buildNumber) {
  throw new Error('Missing build number. Please run the script with the build number as parameter');
}

const parts = buildNumber.split('-');
const buildNumberVersion = parts[0];
if (buildNumberVersion !== packageJson.version) {
  throw new Error(`package.json version is ${packageJson.version} but expected version is ${buildNumberVersion}`);
}

console.log(`package.json version is aligned with expected version ${buildNumberVersion}`);
