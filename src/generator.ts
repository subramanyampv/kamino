import { readFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { compile } from "handlebars";
import * as swagger from "./swagger-definitions";
import * as templates from "./template-definitions";

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

function formatEnum(
  key: string,
  fileName: string,
  definition: swagger.Definition,
  api: swagger.SwaggerDocument
): string {
  const _enum: string[] = definition.enum as string[];
  const enumTemplate: templates.EnumTemplate = {
    fileName,
    typeName: key,
    enumValues: _enum.map(e => ({
      enumField: e,
      enumValue: e
    }))
  };
  return formatEnumTemplate(enumTemplate);
}

function mapPrimitive(type: string): string {
  if (type === "integer") {
    return "number";
  }

  return type;
}

function resolveType(property: swagger.Property): string {
  if (property.type) {
    return mapPrimitive(property.type);
  }

  if (property.$ref) {
    // something like #/definitions/Carrier
    const parts = property.$ref.split("/");
    return parts[parts.length - 1];
  }

  return "string";
}

function mapSwaggerProperty(
  name: string,
  property: swagger.Property,
  definition: swagger.Definition
): templates.Property {
  return {
    name,
    type: resolveType(property),
    required: !!definition.required && definition.required.includes(name)
  };
}

function collectImports(properties: {
  [name: string]: swagger.Property;
}): templates.Import[] {
  return Object.keys(properties).map(p => properties[p])
    .map(p => p.$ref || "")
    .map(h => h.split("/"))
    .filter(parts => parts.length > 1)
    .map(parts => parts[parts.length - 1])
    .map(p => ({
      typeName: p,
      fileName: p
    }));
}

function formatObject(
  key: string,
  fileName: string,
  definition: swagger.Definition,
  api: swagger.SwaggerDocument
): string {
  const swaggerProperties = definition.properties;
  const templateProperties = !swaggerProperties
    ? []
    : Object.keys(swaggerProperties).map(p =>
        mapSwaggerProperty(p, swaggerProperties[p], definition)
      );

  const imports: templates.Import[] = !swaggerProperties
    ? []
    : collectImports(swaggerProperties);
  const objectTemplate: templates.ObjectTemplate = {
    fileName,
    typeName: key,
    properties: templateProperties,
    imports
  };
  return formatObjectTemplate(objectTemplate);
}

function format(
  key: string,
  fileName: string,
  definition: swagger.Definition,
  api: swagger.SwaggerDocument
): string {
  const type = definition.type;
  const _enum = definition.enum;
  if (type === "string" && _enum) {
    return formatEnum(key, fileName, definition, api);
  }

  if (type === "object") {
    return formatObject(key, fileName, definition, api);
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
  const api = safeLoad(contents) as swagger.SwaggerDocument;
  const { definitions } = api;

  const result: { [id: string]: string } = {};

  Object.keys(definitions).forEach(key => {
    const fileName = `${key}.ts`;
    const definition = definitions[key];
    result[fileName] = format(key, fileName, definition, api);
  });

  return result;
}
