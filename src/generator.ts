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
  definition: swagger.EnumDefinition
): string {
  const _enum: string[] = definition.enum;
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

class ObjectParser {
  private imports: templates.Import[] = [];
  private properties: templates.Property[] = [];

  constructor(
    private key: string,
    private fileName: string,
    private definition: swagger.ObjectDefinition
  ) {}

  process(): templates.ObjectTemplate {
    const swaggerProperties = this.definition.properties;

    Object.keys(swaggerProperties).map(p =>
      this.mapSwaggerProperty(p, swaggerProperties[p])
    );

    return {
      fileName: this.fileName,
      typeName: this.key,
      properties: this.properties,
      imports: this.imports
    };
  }

  private mapSwaggerProperty(name: string, property: swagger.Property): void {
    this.properties.push({
      name,
      type: this.resolveType(property),
      required:
        !!this.definition.required && this.definition.required.includes(name)
    });
  }

  private collectReferencedType(name: string): void {
    if (!this.imports.find(p => p.fileName === name)) {
      this.imports.push({
        typeName: name,
        fileName: name
      });
    }
  }

  private mapPrimitive(type: swagger.PropertyType): string {
    if (type === "integer") {
      return "number";
    }

    return type;
  }

  private splitRef(ref: string): string {
    // something like #/definitions/Carrier
    const prefix = "#/definitions/";
    if (ref.startsWith(prefix)) {
      const result = ref.substring(prefix.length);
      this.collectReferencedType(result);
      return result;
    }

    return "";
  }

  private resolveArrayType(t: swagger.Property): string {
    if (swagger.isRefProperty(t)) {
      return this.splitRef(t.$ref) + "[]";
    }

    if (swagger.isTypeProperty(t)) {
      return t.type + "[]";
    }

    return "unsupported[]";
  }

  private resolveType(property: swagger.Property): string {
    if (swagger.isRefProperty(property)) {
      return this.splitRef(property.$ref);
    }

    if (swagger.isTypeProperty(property)) {
      if (swagger.isArrayProperty(property)) {
        return this.resolveArrayType(property.items);
      }

      return this.mapPrimitive(property.type);
    }

    return "string";
  }
}

function formatObject(
  key: string,
  fileName: string,
  definition: swagger.ObjectDefinition
): string {
  const parser = new ObjectParser(key, fileName, definition);
  const objectTemplate = parser.process();
  return formatObjectTemplate(objectTemplate);
}

function format(
  key: string,
  fileName: string,
  definition: swagger.Definition
): string {
  if (swagger.isEnumDefinition(definition)) {
    return formatEnum(key, fileName, definition);
  } else if (swagger.isObjectDefinition(definition)) {
    return formatObject(key, fileName, definition);
  }

  return "";
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
