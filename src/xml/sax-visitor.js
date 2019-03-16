const fs = require('fs');
const sax = require('sax');
const { TagStack } = require('./tag-stack');

class SaxVisitor {
  constructor() {
    this.tagStack = new TagStack();
  }

  process(filename) {
    // initialize variables
    this.filename = filename;
    this.result = null;

    // create SAX stream
    this.saxStream = sax.createStream(true);

    // subscribe to stream events
    this.subscribe();

    return new Promise((resolve, reject) => {
      // on error reject promise
      this.saxStream.on('error', e => reject(e));

      // on end resolve promise with discovered result
      this.saxStream.on('end', () => {
        // resolve promise
        resolve(this.result);
      });

      // pipe the input pom into the SAX stream
      fs.createReadStream(filename)
        .pipe(this.saxStream);
    });
  }

  /**
   * Subscribes to the SAX stream.
   */
  subscribe() {
    this.saxStream.on('opentag', (tag) => {
      this.onOpenTag(tag);
    });

    this.saxStream.on('closetag', (tagName) => {
      this.onCloseTag(tagName);
    });

    this.saxStream.on('text', (text) => {
      this.onText(text);
    });
  }

  onOpenTag(tag) {
    this.tagStack.push(tag.name);
  }

  onCloseTag(tagName) {
    this.tagStack.pop(tagName);
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  onText(text) {
  }
}

module.exports = {
  SaxVisitor
};
