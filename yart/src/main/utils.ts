export function checkArg<T>(arg: T, argName: string): T {
  if (!arg) {
    throw new Error(argName);
  }

  return arg;
}
