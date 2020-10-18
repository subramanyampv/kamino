#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const https = require('https');

const isDeploying = process.argv[2] === 'deploy';

function getChangedFiles() {
  if (process.env['TRAVIS_TAG']) {
    return [];
  }

  const branch = process.env['TRAVIS_PULL_REQUEST_BRANCH'] || process.env['TRAVIS_BRANCH'];
  const onMaster = branch === 'master';
  const commitRange = onMaster ? 'HEAD^' : (process.env['TRAVIS_COMMIT_RANGE'] || 'HEAD^');
  const result = child_process.spawnSync(
    'git',
    ['diff', '--name-only', commitRange],
    { encoding: 'utf8' }
  );
  if (result.status) {
    throw new Error(`Could not get git changed files ${result.stdout} ${result.stderr}`);
  }
  return result.stdout.split(/[\r\n]/).map(s => s.trim()).filter(s => s);
}

const changedFiles = getChangedFiles();

function doesFolderHaveChanges(dir) {
  return changedFiles.some(x => x.startsWith('.travis') || x.startsWith(dir + '/'));
}

function mvnVerify(dir) {
  const result = child_process.spawnSync('mvn', ['-B', 'clean', 'verify'], { cwd: dir, encoding: 'utf8', stdio: 'inherit' });
  if (result.status) {
    throw new Error(`Error building ${dir}`);
  }
}

function npm(dir, tasks) {
  const result = child_process.spawnSync('npm', tasks, { cwd: dir, encoding: 'utf8', stdio: 'inherit' });
  if (result.status) {
    throw new Error(`Error running npm ${tasks} in ${dir}`);
  }
}

function npmInstall(dir) {
  npm(dir, ['install']);
}

function npmRun(dir, task) {
  npm(dir, ['run', task]);
}

async function getLatestPomVersion(dir) {
  const url = `https://repo1.maven.org/maven2/com/github/ngeor/${dir}/maven-metadata.xml`;
  return new Promise(function(resolve, reject) {
    console.log(`Checking ${url}`);
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (resp.statusCode >= 200 && resp.statusCode < 300) {
          console.log(data);
          let re = /<release>([0-9\.]+)/;
          let m = re.exec(data);
          resolve(m[1]);
        } else if (resp.statusCode === 404) {
          // 404 is okay in case the package is new
          resolve('');
        } else {
          reject(new Error(`Error getting ${url}: ${resp.statusCode}: ${data}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkDeploy(dir) {
  const pomContents = fs.readFileSync(path.join(dir, 'pom.xml'), 'utf8');
  if (!/<distributionManagement>/.test(pomContents)) {
    return;
  }

  console.log(`${dir} is deployable, checking version`);
  const m = /<version>([0-9\.]+)/.exec(pomContents);
  if (!m || !m[1]) {
    return;
  }

  const pomVersion = m[1];
  console.log(`Found pom.xml version ${pomVersion} for ${dir}`);
  const mavenVersion = await getLatestPomVersion(dir);
  if (pomVersion === mavenVersion) {
    console.log(`Will not deploy ${dir} because pom version is already published`);
  } else {
    console.log(`Deploying ${dir} because pom version is ${pomVersion} and maven version is ${mavenVersion}`);
    const result = child_process.spawnSync('.travis/gpg-maven.sh', ['deploy'], { cwd: dir, encoding: 'utf8', stdio: 'inherit', shell: true });
    if (result.status) {
      throw new Error(`Error deploying ${dir}`);
    }
  }
}

async function deployDirs(dirs) {
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    if (!doesFolderHaveChanges(dir)) {
      continue;
    }

    console.log('******************************************')
    console.log(`Deploying ${dir}`);
    console.log('******************************************')
    await checkDeploy(dir);
  }
}

function buildDirs(dirs) {
  for (let i = 0; i < dirs.length; i++) {
    let dir = dirs[i];
    if (!doesFolderHaveChanges(dir)) {
      continue;
    }
    console.log('******************************************')
    console.log(`Building ${dir}`);
    console.log('******************************************')
    mvnVerify(dir);

    if (dir === 'bitbucket-pr-report') {
      npmInstall(path.join(dir, 'bprr-ui'));
      npmRun(path.join(dir, 'bprr-ui'), 'build');
    }
  }
}

const dirs = fs.readdirSync('.')
  .sort()
  .filter(f => !f.startsWith('.')) // e.g. .git
  .filter(f => fs.statSync(f).isDirectory());

if (isDeploying) {
  deployDirs(dirs, 0);
} else {
  buildDirs(dirs);
}
