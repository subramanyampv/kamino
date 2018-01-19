const path = require('path');
const ejs = require('ejs');

/**
 * Converts tabs to spaces.
 * @param {string} contents The file contents.
 * @returns {string} The new file contents.
 * @private
 */
function tabsToSpaces(contents) {
    return contents.replace(/\t/g, '    ');
}

/**
 * Builds the copier function.
 * @param {*} fs The filesystem.
 * @param {*} context The context available during template rendering.
 * @param {string} indentationCharacter The indentation character ('tabs' or 'spaces').
 * @returns {function} The copier function.
 */
function buildCopier(fs, context, indentationCharacter) {
    // default processor using ejs
    const defaultProcessor = (contents) => ejs.render(contents.toString(), context);

    // if indentation is spaces, convert tabs to spaces
    const indentingProcessor = indentationCharacter === 'tabs' ?
        defaultProcessor : (contents) => ejs.render(tabsToSpaces(contents.toString()), context);

    /**
     * Selects the processor to use for the given filename.
     * @param {string} filename - The file name to copy.
     * @returns {function} A content processor.
     */
    function selectProcessor(filename) {
        if (path.extname(filename) === '.cs') {
            return indentingProcessor;
        }

        return defaultProcessor;
    }

    /**
     * Copies a file.
     * @param {string} from - The source file.
     * @param {string} to - The destination file.
     * @returns {void}
     */
    function copier(from, to) {
        const process = selectProcessor(from);
        return fs.copy(from, to, {
            process
        });
    }

    return copier;
}

module.exports = {
    buildCopier
};
