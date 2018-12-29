/**
 * Converts an input filename to a destination filename.
 * @param {string} filename - The input filename.
 * @param {{name: [string], templateName: [string]}} options - Conversion options.
 * @returns {string} The converted filename.
 */
module.exports = function (filename, options) {
  let result = filename.replace(/([a-z]*)_([a-z]+)/ig, ($0, $1, $2) => ($1 ? $0 : `.${$2}`));

  if (options && options.name && options.templateName) {
    result = result.replace(new RegExp(options.templateName, 'g'), options.name);
  }

  return result;
};
