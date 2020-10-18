import path = require('path');
import fs = require('fs');
import { PomDom } from './get-pom-version';
import { dom } from '../xml/dom';
import { updateXml } from '../xml/update-xml';

interface UpdatePomOptionsModules {
  dir: string;
  fs: typeof fs;
  newVersion: string;
}

async function handleModules(
  modules,
  opts: UpdatePomOptionsModules,
  result
): Promise<string[]> {
  const {
    dir, newVersion, fs
  } = opts;

  if (modules && modules.length) {
    await Promise.all(modules.map(module => updateXml(
      fs,
      path.join(dir, module, 'pom.xml'),
      { project: { parent: { version: newVersion } } }
    )));

    return result.concat(modules.map(module => path.join(module, 'pom.xml')));
  }

  return result;
}

interface UpdatePomFilesArgs extends UpdatePomOptionsModules {
  currentVersion: string;
}

/**
 * Updates the pom files in the given directory.
 * @param {UpdateOptions} opts The options.
 * @returns {Promise<string[]>} An array of the modified files.
 */
export async function updatePomFiles(opts: UpdatePomFilesArgs): Promise<string[]> {
  const {
    dir, currentVersion, newVersion, fs
  } = opts;
  const pomFilePath = path.join(dir, 'pom.xml');
  let result = [];

  if (fs.existsSync(pomFilePath)) {
    const contents = (await dom(pomFilePath)) as PomDom;
    const modules = contents && contents.project
      && contents.project.modules && contents.project.modules.module;
    if (contents.project.version === currentVersion) {
      result.push('pom.xml');
      await updateXml(fs, pomFilePath, { project: { version: newVersion } });
    }

    result = await handleModules(modules, opts, result);
  }

  return result;
}
