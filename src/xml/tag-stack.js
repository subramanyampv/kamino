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

exports.TagStack = TagStack;
