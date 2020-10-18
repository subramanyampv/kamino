import { SaxVisitor } from './sax-visitor';
import { WriteableBuffer } from './writeable-buffer';

/**
 * Escapes quotes inside an attribute value.
 * @param str The attribute value to escape.
 * @returns The escaped text.
 */
function escapeQuotes(str: string): string {
  return str.split('"').join('&quot;');
}

export class SaxWriter<TResult> extends SaxVisitor<TResult> {
  protected out = new WriteableBuffer();

  constructor(protected fs) {
    super();
  }

  onOpenTag(tag): void {
    super.onOpenTag(tag);
    this.write(`<${tag.name}`);
    Object.keys(tag.attributes).forEach(key => this.write(` ${key}="${escapeQuotes(tag.attributes[key])}"`));
    this.write('>');
  }

  onCloseTag(tagName: string): void {
    super.onCloseTag(tagName);
    this.write(`</${tagName}>`);
  }

  onText(text): void {
    this.write(text);
  }

  subscribe(): void {
    super.subscribe();

    // The rest of the events go as-is
    this.saxStream.on('doctype', text => this.write(text));
    this.saxStream.on('cdata', data => this.write(`<![CDATA[${data}]]>`));
    this.saxStream.on('comment', comment => this.write(`<!--${comment}-->`));
    this.saxStream.on('processinginstruction', i => this.write(`<?${i.name} ${i.body}?>`));
  }

  write(str: string): void {
    this.out.write(str);
  }

  process(filename): Promise<TResult> {
    return super.process(filename).then(result => {
      if (result) {
        this.fs.writeFileSync(filename, this.out.buffer);
      }

      return result;
    });
  }
}
