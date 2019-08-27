const fs = require('fs');
const { SaxVisitor } = require('./sax-visitor');
const { WriteableBuffer } = require('./writeable-buffer');

/**
 * Escapes quotes inside an attribute value.
 * @param {string} str The attribute value to escape.
 * @returns {string} The escaped text.
 */
function escapeQuotes(str) {
  return str.split('"').join('&quot;');
}

class SaxWriter extends SaxVisitor {
  constructor() {
    super();
    this.out = new WriteableBuffer();
  }

  onOpenTag(tag) {
    super.onOpenTag(tag);
    this.write(`<${tag.name}`);
    Object.keys(tag.attributes).forEach((key) => this.write(` ${key}="${escapeQuotes(tag.attributes[key])}"`));
    this.write('>');
  }

  onCloseTag(tagName) {
    super.onCloseTag(tagName);
    this.write(`</${tagName}>`);
  }

  onText(text) {
    super.onText(text);
    this.write(text);
  }

  subscribe() {
    super.subscribe();

    // the rest of the events go as-is
    this.saxStream.on('doctype', (text) => this.write(text));
    this.saxStream.on('cdata', (data) => this.write(`<![CDATA[${data}]]>`));
    this.saxStream.on('comment', (comment) => this.write(`<!--${comment}-->`));
    this.saxStream.on('processinginstruction', (i) => this.write(`<?${i.name} ${i.body}?>`));
  }

  write(str) {
    this.out.write(str);
  }

  process(filename) {
    return super.process(filename).then((result) => {
      if (result) {
        // TODO this should not be here but in other classes
        fs.writeFileSync(filename, this.out.buffer);
      }

      return result;
    });
  }
}

module.exports = {
  SaxWriter
};
