import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { EOL } from "os";

enum DefinitionType {
  STRING = 'string',
  OBJECT = 'object'
}

interface Definition {
  type: DefinitionType;
  enum?: string[];
}

function formatEnum(key: string, definition: Definition, api: object): string {
  const _enum: string[] = definition.enum as string[];
  const members = _enum.map(e => `  ${e} = "${e}"`).join(`,${EOL}`);
  return `export enum ${key} {
${members}
}`;
}

function format(key: string, definition: Definition, api: object): string {
  const type = definition.type;
  const _enum = definition.enum;
  if (type === 'string' && _enum) {
    return formatEnum(key, definition, api);
  }

  return '';
}

/**
 * Generates a project out of the given file.
 * Returns the file contents in-memory. The resulting object
 * has paths as keys and file contents as values.
 * @param specFile The input Swagger file.
 */
export function generate(specFile: string): { [id: string]: string } {
  const contents = readFileSync(specFile, { encoding: 'utf8' });
  const api = safeLoad(contents);
  const { definitions } = api;

  const result: { [id: string]: string } = {};

  Object.keys(definitions).forEach(key => {
    const filename = `${key}.ts`;
    const definition = definitions[key];

    result[filename] = `// ${filename}
${format(key, definition, api)}
`
  });

  return result;
}
