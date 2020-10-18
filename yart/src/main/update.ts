import { Git } from './git/git';
import path = require('path');
import { updatePomFiles } from './pom/update-pom-files';
import fs = require('fs');

export interface UpdateOptions {
  git: Git;
  dir: string;
  currentVersion: string;
  newVersion: string;
  fs: typeof fs;
}

/**
 * Updates the version in the project files and adds modified files to git.
 * @param opts The update options.
 * @param file The file to update the version in.
 */
function updateTextFile(
  opts: UpdateOptions,
  file: string
): Promise<string[]> {
  const result = [];
  const {
    dir, currentVersion, newVersion, fs
  } = opts;
  const fullPath = path.join(dir, file);
  if (fs.existsSync(fullPath)) {
    const contents = fs.readFileSync(fullPath, 'utf8');
    const modifiedContents = contents.split(currentVersion).join(newVersion);
    if (contents !== modifiedContents) {
      fs.writeFileSync(fullPath, modifiedContents, 'utf8');
      result.push(file);
    }
  }

  return Promise.resolve(result);
}

/**
 * Updates the version in the project files and adds modified files to git.
 * @param git The git object.
 * @param getModifiedFilesAsync A function that collects modified
 * files.
 */
async function updateAndAdd(
  git: Git,
  getModifiedFilesAsync: () => Promise<string[]>
): Promise<void> {
  const files: string[] = await getModifiedFilesAsync();
  files.forEach(file => git.add(file));
}

/**
 * Updates the version in the project files.
 * @param opts The update options.
 */
export async function updateProjectFiles(opts: UpdateOptions): Promise<void> {
  await updateAndAdd(opts.git, () => updatePomFiles(opts));
  await updateAndAdd(opts.git, () => updateTextFile(opts, 'README.md'));
}
