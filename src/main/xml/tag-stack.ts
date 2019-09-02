export class TagStack {
  stack: string[] = [];

  /**
   * Pushes a tag in the stack.
   * @param tagName The name of tag.
   */
  push(tagName: string): void {
    this.stack.push(tagName);
  }

  /**
   * Pops the last tag from the stack.
   * If it does not match the parameter, an error is thrown.
   * @param tagName The name of the expected tag.
   */
  pop(tagName: string): void {
    if (!this.stack.length) {
      throw new Error('Unexpected state');
    }

    if (this.stack[this.stack.length - 1] !== tagName) {
      throw new Error('Unexpected state');
    }

    this.stack.splice(this.stack.length - 1);
  }
}
