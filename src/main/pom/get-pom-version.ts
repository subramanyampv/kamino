import path = require('path');
import { dom } from '../xml/dom';

export interface PomDom {
  project?: {
    version: string;

    modules?: {
      module: string[];
    };

    parent?: {
      version: string;
    };
  };
}

/**
 * Gets a promise that resolves into the version defined in a pom file.
 * @param {string} dir The directory containing the pom file.
 */
export async function getPomVersion(dir): Promise<string> {
  const pomFilePath = path.join(dir, 'pom.xml');
  const result = (await dom(pomFilePath)) as PomDom;
  return result.project.version;
}
