/**
 * Converts an input filename to a destination filename.
 * @param {string} filename - The input filename.
 * @param {object} options - Conversion options.
 * @returns {string} The converted filename.
 */
module.exports = function(filename, options) {
    let result = filename.replace(/([a-z]*)_([a-z]+)/ig, function($0, $1, $2) {
        return $1 ? $0 : '.' + $2;
    });

    if (options && options.name) {
        result = result.replace(/MyLib/g, options.name);
    }

    return result;
};
