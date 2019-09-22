/**
 * Holds definitions of the objects expected by our templates.
 */


/**
 * Represents a single enum field.
 */
export interface EnumTemplateValue {
  enumField: string;
  enumValue: string;
}

/**
 * Represents an enum.
 */
export interface EnumTemplate {
  fileName: string;
  typeName: string;
  enumValues: EnumTemplateValue[];
}

export interface Property {
  name: string;
  type: string;
  required: boolean;
}

export interface Import {
  fileName: string;
  typeName: string;
}

export interface ObjectTemplate {
  fileName: string;
  typeName: string;
  properties: Property[];
  imports: Import[];
}
