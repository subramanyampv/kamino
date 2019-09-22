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

export enum DefinitionType {
  STRING = "string",
  OBJECT = "object"
}

export interface Definition {
  type: DefinitionType;
  required?: string[];
  properties?: { [name: string]: Property };
  enum?: string[];
}

export interface Property {
  type?: string;
  description?: string;
  $ref?: string;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
}
