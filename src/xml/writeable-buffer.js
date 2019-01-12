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

exports.WriteableBuffer = WriteableBuffer;
