import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { compile } from "handlebars";
import * as swagger from "./swagger-definitions";
import * as templates from "./template-definitions";
import { PropertyVisitor } from "./PropertyVisitor";

export type StringDictionary = { [id: string]: string };

function formatEnumTemplate(enumTemplate: templates.EnumTemplate): string {
  const template = readFileSync("src/templates/enum.ts.hbs", {
    encoding: "utf8"
  });
  return compile(template)(enumTemplate);
}

function formatObjectTemplate(
  objectTemplate: templates.ObjectTemplate
): string {
  const template = readFileSync("src/templates/object.ts.hbs", {
    encoding: "utf8"
  });
  return compile(template)(objectTemplate);
}

function format(
  key: string,
  fileName: string,
  definition: swagger.Property
): string {
  const propertyVisitor = new PropertyVisitor();
  propertyVisitor.visit(key, definition);

  if (swagger.isEnumProperty(definition)) {
    return formatEnumTemplate(propertyVisitor.toEnumTemplate(fileName));
  } else {
    return formatObjectTemplate(propertyVisitor.toObjectTemplate(fileName));
  }
}

/**
 * Generates a project out of the given file.
 * Returns the file contents in-memory. The resulting object
 * has paths as keys and file contents as values.
 * @param specFile The input Swagger file.
 */
export function generate(specFile: string): StringDictionary {
  const contents = readFileSync(specFile, { encoding: "utf8" });
  const api = safeLoad(contents) as swagger.SwaggerDocument;
  const { definitions } = api;

  const result: StringDictionary = {};

  Object.keys(definitions).forEach(key => {
    const fileName = `${key}.ts`;
    const definition = definitions[key];
    result[fileName] = format(key, fileName, definition);
  });

  return result;
}
