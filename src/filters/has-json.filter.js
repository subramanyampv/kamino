const fs = require('fs');
const path = require('path');

class Parser {
  /**
   * Creates an instance of this class.
   * @param {string} data
   */
  constructor(data) {
    this.data = data;
    this.pos = 0;
  }

  readUntilCharacter(char) {
    let i = this.pos;
    while (i < this.data.length && this.data[i] !== char) {
      i += 1;
    }

    const result = this.data.substring(this.pos, i);
    this.pos = i + 1;
    return result;
  }
}

module.exports = function hasJsonFilter(file, cliArgs) {
  if (!cliArgs.hasJson) {
    return true;
  }

  const parser = new Parser(cliArgs.hasJson);
  const filename = parser.readUntilCharacter(';');
  const resolvedFilename = path.resolve(cliArgs.dir, file.name, filename);
  if (!fs.existsSync(resolvedFilename)) {
    return false;
  }

  const contents = fs.readFileSync(resolvedFilename, 'utf8');
  if (!contents) {
    return false;
  }

  let json;
  try {
    json = JSON.parse(contents);
  } catch (e) {
    json = null;
  }

  if (!json) {
    return false;
  }

  const jsonProperty = parser.readUntilCharacter(' ');
  const operator = parser.readUntilCharacter(' ');
  const value = parser.readUntilCharacter(' ');

  const properties = jsonProperty.split('.');
  let obj = json;
  for (let i = 0; i < properties.length && typeof obj === 'object'; i += 1) {
    obj = obj[properties[i]];
  }

  if (!obj) {
    return false;
  }

  if (operator === 'contains') {
    return obj.indexOf(value) >= 0;
  }

  if (operator === '==') {
    return obj === value;
  }

  if (operator === '!=') {
    return obj !== value;
  }

  return true;
};
