import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { compile } from "handlebars";

enum DefinitionType {
  STRING = "string",
  OBJECT = "object"
}

export type StringDictionary = { [id: string]: string };

interface Definition {
  type: DefinitionType;
  enum?: string[];
}

/**
 * Represents a single enum field.
 */
interface EnumTemplateValue {
  enumField: string;
  enumValue: string;
}

/**
 * Represents an enum.
 */
interface EnumTemplate {
  fileName: string;
  typeName: string;
  enumValues: EnumTemplateValue[];
}

function formatEnumTemplate(enumTemplate: EnumTemplate): string {
  const template = readFileSync("src/templates/enum.ts.hbs", {
    encoding: "utf8"
  });
  return compile(template)(enumTemplate);
}

function formatEnum(
  key: string,
  fileName: string,
  definition: Definition,
  api: object
): string {
  const _enum: string[] = definition.enum as string[];
  const enumTemplate: EnumTemplate = {
    fileName,
    typeName: key,
    enumValues: _enum.map(e => ({
      enumField: e,
      enumValue: e
    }))
  };
  return formatEnumTemplate(enumTemplate);
}

function format(
  key: string,
  fileName: string,
  definition: Definition,
  api: object
): string {
  const type = definition.type;
  const _enum = definition.enum;
  if (type === "string" && _enum) {
    return formatEnum(key, fileName, definition, api);
  }

  return "";
}

/**
 * Generates a project out of the given file.
 * Returns the file contents in-memory. The resulting object
 * has paths as keys and file contents as values.
 * @param specFile The input Swagger file.
 */
export function generate(specFile: string): { [id: string]: string } {
  const contents = readFileSync(specFile, { encoding: "utf8" });
  const api = safeLoad(contents);
  const { definitions } = api;

  const result: { [id: string]: string } = {};

  Object.keys(definitions).forEach(key => {
    const fileName = `${key}.ts`;
    const definition = definitions[key];
    result[fileName] = format(key, fileName, definition, api);
  });

  return result;
}
