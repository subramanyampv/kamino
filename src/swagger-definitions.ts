/**
 * Holds definitions of the objects we find in a Swagger file.
 */

/**
 * A swagger document.
 */
export interface SwaggerDocument {
  swagger: string;
  host: string;
  basePath: string;
  paths: { [path: string]: Path };
  definitions: { [definition: string]: Definition };
}

export interface Path {
  post?: PathVerb;
}

export interface PathVerb {
  summary: string;
  operationId: string;
}

export type DefinitionType = "string" | "object";

export interface Definition {
  type: DefinitionType;
}

export interface ObjectDefinition extends Definition {
  required?: string[];
  properties: { [name: string]: Property };
}

export function isObjectDefinition(d: Definition): d is ObjectDefinition {
  return "properties" in d;
}

export interface HasRef {
  $ref: string;
}

export interface ComposedObjectDefinition extends Definition {
  allOf: (HasRef | ObjectDefinition)[];
}

export function isComposedObjectDefinition(
  d: Definition
): d is ComposedObjectDefinition {
  return "allOf" in d;
}

export interface EnumDefinition extends Definition {
  enum: string[];
}

export function isEnumDefinition(d: Definition): d is EnumDefinition {
  return d.type === "string" && "enum" in d;
}

export type PropertyType = "string" | "array" | "integer" | "number" | "object";

export interface Property {
  description?: string;
}

export interface RefProperty extends Property, HasRef {}

export function isRefProperty(p: Property): p is RefProperty {
  return "$ref" in p;
}

export interface TypeProperty extends Property {
  type: PropertyType;
  minLength?: number;
  maxLength?: number;
}

export function isTypeProperty(p: Property): p is TypeProperty {
  return "type" in p;
}

export interface ArrayProperty extends TypeProperty {
  items: Property;
  minItems?: number;
  maxItems?: number;
}

export function isArrayProperty(p: TypeProperty): p is ArrayProperty {
  return p.type === "array" && "items" in p;
}
