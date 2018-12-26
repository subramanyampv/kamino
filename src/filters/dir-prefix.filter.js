module.exports = function dirPrefixFilter(file, cliArgs) {
  return !cliArgs.dirPrefix
    || !cliArgs.dirPrefix.length
    || !!cliArgs.dirPrefix.find(p => file.name.startsWith(p));
};
