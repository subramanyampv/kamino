const path = require('path');
const sax = require('sax');

/**
 * Escapes quotes inside an attribute value.
 * @param {string} str The attribute value to escape.
 * @returns {string} The escaped text.
 */
function escapeQuotes(str) {
  return str.split('"').join('&quot;');
}

class TagStack {
  constructor() {
    this.stack = [];
  }

  isAtPath(...args) {
    if (this.stack.length !== args.length) {
      return false;
    }

    let i = 0;
    while (i < this.stack.length) {
      if (this.stack[i] !== args[i]) {
        return false;
      }

      i += 1;
    }

    return true;
  }

  /**
   * Pushes a tag in the stack.
   * @param {string} tagName The name of tag.
   */
  push(tagName) {
    this.stack.push(tagName);
  }

  /**
   * Pops the last tag from the stack.
   * If it does not match the parameter, an error is thrown.
   * @param {string} tagName The name of the expected tag.
   */
  pop(tagName) {
    if (!this.stack.length) {
      throw new Error('Unexpected state');
    }

    if (this.stack[this.stack.length - 1] !== tagName) {
      throw new Error('Unexpected state');
    }

    this.stack.splice(this.stack.length - 1);
  }
}

class WriteableBuffer {
  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  write(text) {
    if (!text) {
      return;
    }

    const newBuffer = Buffer.from(text);
    this.buffer = Buffer.concat([this.buffer, newBuffer]);
  }
}

function createStreamPromise(opts, filename, saxStream) {
  return new Promise((resolve, reject) => {
    saxStream.on('error', e => reject(e));

    // on end resolve promise
    saxStream.on('end', () => {
      // resolve promise
      resolve();
    });

    // pipe the input pom into the SAX stream
    opts.fs.createReadStream(filename)
      .pipe(saxStream);
  });
}

async function updateChildPomFile(opts, moduleName) {
  const {
    fs, dir, currentVersion, newVersion,
  } = opts;
  const pomFilePath = path.join(dir, moduleName, 'pom.xml');
  const saxStream = sax.createStream(true);
  const out = new WriteableBuffer();
  const tagStack = new TagStack();
  let result = null;

  // on open tag
  saxStream.on('opentag', (tag) => {
    tagStack.push(tag.name);
    out.write(`<${tag.name}`);
    Object.keys(tag.attributes).forEach(key => out.write(` ${key}="${escapeQuotes(tag.attributes[key])}"`));
    out.write('>');
  });

  // on close tag
  saxStream.on('closetag', (tagName) => {
    tagStack.pop(tagName);
    out.write(`</${tagName}>`);
  });

  // on text
  saxStream.on('text', (text) => {
    if (tagStack.isAtPath('project', 'parent', 'version') && text === currentVersion) {
      out.write(newVersion);
      result = path.join(moduleName, 'pom.xml');
    } else {
      out.write(text);
    }
  });

  // the rest of the events go as-is
  saxStream.on('doctype', text => out.write(text));
  saxStream.on('cdata', data => out.write(`<![CDATA[${data}]]>`));
  saxStream.on('comment', comment => out.write(`<!--${comment}-->`));
  saxStream.on('processinginstruction', i => out.write(`<?${i.name} ${i.body}?>`));

  await createStreamPromise(opts, pomFilePath, saxStream);

  // save file
  fs.writeFileSync(pomFilePath, out.buffer);

  return result;
}

/**
 * @typedef UpdateOptions
 * @type {object}
 * @property {string} dir The directory with the git repository.
 * @property {string} currentVersion The current version.
 * @property {string} newVersion The new version.
 * @property {typeof import("fs")} fs The file system object.
 */

/**
 * Updates the pom files in the given directory.
 * @param {UpdateOptions} opts The options.
 * @returns {Promise<string[]>} An array of the modified files.
 */
async function updatePomFiles(opts) {
  const {
    fs, dir, currentVersion, newVersion,
  } = opts;
  const pomFilePath = path.join(dir, 'pom.xml');
  let result = [];

  const childModules = [];

  if (fs.existsSync(pomFilePath)) {
    const saxStream = sax.createStream(true);
    const out = new WriteableBuffer();
    const tagStack = new TagStack();

    // on open tag
    saxStream.on('opentag', (tag) => {
      tagStack.push(tag.name);
      out.write(`<${tag.name}`);
      Object.keys(tag.attributes).forEach(key => out.write(` ${key}="${escapeQuotes(tag.attributes[key])}"`));
      out.write('>');
    });

    // on close tag
    saxStream.on('closetag', (tagName) => {
      tagStack.pop(tagName);
      out.write(`</${tagName}>`);
    });

    // on text
    saxStream.on('text', (text) => {
      if (tagStack.isAtPath('project', 'version') && text === currentVersion) {
        out.write(newVersion);
        result.push('pom.xml');
      } else if (tagStack.isAtPath('project', 'modules', 'module')) {
        childModules.push(text);
        out.write(text);
      } else {
        out.write(text);
      }
    });

    // the rest of the events go as-is
    saxStream.on('doctype', text => out.write(text));
    saxStream.on('cdata', data => out.write(`<![CDATA[${data}]]>`));
    saxStream.on('comment', comment => out.write(`<!--${comment}-->`));
    saxStream.on('processinginstruction', i => out.write(`<?${i.name} ${i.body}?>`));

    await createStreamPromise(opts, pomFilePath, saxStream);

    // save file
    fs.writeFileSync(pomFilePath, out.buffer);

    // handle child modules
    result = result.concat(
      await Promise.all(
        childModules.map(childModule => updateChildPomFile(
          opts, childModule,
        )),
      ),
    );
  }

  return result;
}

module.exports = {
  updatePomFiles,
};
