export class WriteableBuffer {
  buffer: Buffer;

  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  write(text: string): void {
    if (!text) {
      return;
    }
    const newBuffer = Buffer.from(text);
    this.buffer = Buffer.concat([
      this.buffer,
      newBuffer
    ]);
  }
}
