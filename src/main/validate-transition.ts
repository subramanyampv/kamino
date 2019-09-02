export const bumpCodes = [
  'patch',
  'minor',
  'major'
];

export function isSemVerFormat(version: string): boolean {
  return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}

export function splitSemVer(version: string): number[] {
  if (!version) {
    throw new Error('version');
  }

  if (!isSemVerFormat(version)) {
    throw new Error(`Version ${version} is not SemVer.`);
  }

  return version.split('.').map(part => parseInt(part, 10));
}
