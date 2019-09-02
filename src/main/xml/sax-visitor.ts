import fs = require('fs');
import sax = require('sax');
import { TagStack } from './tag-stack';
import { checkArg } from '../utils';

export abstract class SaxVisitor<TResult> {
  protected tagStack = new TagStack();

  protected result: TResult = null;

  protected saxStream: sax.SAXStream = null;

  process(filename: string): Promise<TResult> {
    // Initialize variables
    checkArg(filename, 'filename is required');
    this.result = null;

    // Create SAX stream
    this.saxStream = sax.createStream(true);

    // Subscribe to stream events
    this.subscribe();

    return new Promise((resolve, reject): void => {
      // On error reject promise
      this.saxStream.on('error', err => reject(err));

      // On end resolve promise with discovered result
      this.saxStream.on('end', () => {
        // Resolve promise
        resolve(this.result);
      });

      // Pipe the input pom into the SAX stream
      fs.createReadStream(filename)
        .pipe(this.saxStream);
    });
  }

  /**
   * Subscribes to the SAX stream.
   */
  subscribe(): void {
    this.saxStream.on('opentag', tag => {
      this.onOpenTag(tag);
    });

    this.saxStream.on('closetag', tagName => {
      this.onCloseTag(tagName);
    });

    this.saxStream.on('text', text => {
      this.onText(text);
    });
  }

  onOpenTag(tag: sax.BaseTag): void {
    this.tagStack.push(tag.name);
  }

  onCloseTag(tagName: string): void {
    this.tagStack.pop(tagName);
  }

  abstract onText(text: string): void;
}
