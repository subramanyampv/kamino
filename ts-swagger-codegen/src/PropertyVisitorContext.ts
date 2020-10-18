import * as swagger from "./swagger-definitions";
import * as templates from "./template-definitions";

export interface Context {
  property: swagger.Property;
  typeName: string;
  properties: templates.Property[];
  enums: templates.EnumTemplateValue[];
  imports: templates.Import[];
  collectedRefs: string[];
  baseTypes: templates.Import[];
}

export function newContext(partial: Partial<Context>): Context {
  return {
    property: partial.property || {},
    typeName: partial.typeName || "",
    properties: partial.properties || [],
    enums: partial.enums || [],
    imports: partial.imports || [],
    collectedRefs: partial.collectedRefs || [],
    baseTypes: partial.baseTypes || []
  };
}
