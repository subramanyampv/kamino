import path = require('path');

export function fixturePath(relativePath: string): string {
  return path.join(__dirname, '..', 'fixtures', relativePath);
}
