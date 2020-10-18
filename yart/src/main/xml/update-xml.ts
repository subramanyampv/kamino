import { SaxWriter } from './sax-writer';

class FilterWriter extends SaxWriter<boolean> {
  constructor(fs, private modifications) {
    super(fs);
  }

  onText(text): void {
    let context = this.modifications;
    let found = false;
    for (let i = 0; i < this.tagStack.stack.length; i += 1) {
      const item = this.tagStack.stack[i];
      if (Object.prototype.hasOwnProperty.call(context, item)) {
        context = context[item];
        found = true;
      } else {
        found = false;
        break;
      }
    }

    this.handleOnText(found, text, context);
  }

  handleOnText(found, text, context): void {
    if (found && typeof context === 'string' && text !== context) {
      // To indicate that we need to write changes
      this.result = true;
      super.onText(context);
    } else {
      super.onText(text);
    }
  }
}

export async function updateXml(fs, filename, modifications): Promise<void> {
  const writer = new FilterWriter(fs, modifications);
  await writer.process(filename);
}
