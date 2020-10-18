/**
 * Converts an input filename to a destination filename.
 * @param {string} filename - The input filename.
 * @param {{name: [string], templateName: [string]}} options - Conversion options.
 * @returns {string} The converted filename.
 */
module.exports = function convertFilename(filename, options) {
  // maps the leading underscore to a dot (e.g. _gitignore -> .gitignore)
  const result = filename.replace(/([a-z]*)_([a-z]+)/ig, ($0, $1, $2) => ($1 ? $0 : `.${$2}`));

  // map the template name into the actual project name
  const { name, templateName } = options;
  return result.replace(new RegExp(templateName, 'g'), name);
};
