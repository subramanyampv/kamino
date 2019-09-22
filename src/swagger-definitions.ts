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
  definitions: { [definition: string]: Property };
}

export interface Path {
  post?: PathVerb;
}

export interface PathVerb {
  summary: string;
  operationId: string;
}

export type PropertyType = "string" | "array" | "integer" | "number" | "object";

export interface Property {
  description?: string;
}

/**
 * An enum e.g.
 * ```yaml
 * Order:
 *   type: string
 *   enum:
 *     - ASC
 *     - DESC
 * ```
 */
export interface EnumProperty extends Property {
  enum: string[];
}

export function isEnumProperty(p: Property): p is EnumProperty {
  return "enum" in p;
}

/**
 * An object that consists of other properties.
 */
export interface ObjectProperty extends Property {
  required?: string[];
  properties: { [name: string]: Property };
}

export function isObjectProperty(p: Property): p is ObjectProperty {
  return "properties" in p;
}

/**
 * A property that points to a different type.
 */
export interface RefProperty extends Property {
  $ref: string;
}

export function isRefProperty(p: Property): p is RefProperty {
  return "$ref" in p;
}

/**
 * A property that is composed of other definitions.
 */
export interface CompositeProperty extends Property {
  allOf: (RefProperty | ObjectProperty)[];
}

export function isCompositeProperty(p: Property): p is CompositeProperty {
  return "allOf" in p;
}

export interface TypeProperty extends Property {
  type: PropertyType;
  minLength?: number;
  maxLength?: number;
}

export function isTypeProperty(p: Property): p is TypeProperty {
  return "type" in p;
}

export function isSimpleTypeProperty(p: Property): p is TypeProperty {
  return isTypeProperty(p) && p.type !== "object" && p.type !== "array";
}

export interface ArrayProperty extends TypeProperty {
  items: Property;
  minItems?: number;
  maxItems?: number;
}

export function isArrayProperty(p: Property): p is ArrayProperty {
  return isTypeProperty(p) && p.type === "array" && "items" in p;
}
