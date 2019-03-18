const { SaxWriter } = require('./sax-writer');

class FilterWriter extends SaxWriter {
  constructor(modifications) {
    super();
    this.modifications = modifications;
  }

  onText(text) {
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

    if (found && typeof context === 'string' && text !== context) {
      // to indicate that we need to write changes
      this.result = true;
      super.onText(context);
    } else {
      super.onText(text);
    }
  }
}

async function updateXml(filename, modifications) {
  const writer = new FilterWriter(modifications);
  await writer.process(filename);
}

module.exports = updateXml;
