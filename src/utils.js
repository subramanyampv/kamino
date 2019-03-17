function checkArg(arg, argName) {
  if (!arg) {
    throw new Error(argName);
  }

  return arg;
}

module.exports = {
  checkArg
};
