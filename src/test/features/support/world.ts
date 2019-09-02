import fs = require('fs');
import path = require('path');
import { Git } from '../../../main/git/git';
import { fixturePath } from '../../utils/path-utils';
import { registerTemporaryFolder } from './hooks';
import { setWorldConstructor } from 'cucumber';

declare module 'cucumber' {
  interface World {
    tempDirectory: string;
    git: Git;
    oldSha: string;
    err?: Error;
  }
}

class CustomWorld {
  private _tempDirectory: string;

  private _git: Git;

  oldSha: string = null;

  get git(): Git {
    return this._git;
  }

  get tempDirectory(): string {
    return this._tempDirectory;
  }

  set tempDirectory(value) {
    this._tempDirectory = value;
    registerTemporaryFolder(value);
    this._git = new Git(value);
  }

  /**
   * Copies a file from the fixtures directory into the temporary folder of the test.
   * @param {string} filePath The file path, relative to the fixtures directory
   */
  copy(filePath, newFileName): void {
    if (!this.tempDirectory) {
      throw new Error('Temporary directory not set');
    }

    const sourcePath = fixturePath(filePath);
    const parts = filePath.split('/');
    let destPath = this.tempDirectory;
    const destFileName = newFileName || parts[parts.length - 1];

    /*
     * Create intermediate directories
     * Skip the first element because it is the fixture name
     */
    for (let i = 1; i < parts.length - 1; i++) {
      destPath = path.join(destPath, parts[i]);
      fs.mkdirSync(destPath);
    }

    destPath = path.join(destPath, destFileName);
    fs.copyFileSync(sourcePath, destPath);
  }

  commit(message): void {
    this.git.commit(message);
    this.oldSha = this.git.currentSha();
  }
}

setWorldConstructor(CustomWorld);
