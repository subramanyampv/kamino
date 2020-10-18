import * as swagger from "./swagger-definitions";
import * as templates from "./template-definitions";
import { Tree } from "./TreeNode";
import { Context, newContext } from "./PropertyVisitorContext";

export class PropertyVisitor {
  private tree: Tree<Context> = new Tree<Context>();

  visit(name: string, property: swagger.Property) {
    if (swagger.isEnumProperty(property)) {
      this.visitEnumProperty(name, property);
    } else if (swagger.isObjectProperty(property)) {
      this.visitObjectProperty(name, property);
    } else if (swagger.isRefProperty(property)) {
      this.visitRefProperty(name, property);
    } else if (swagger.isCompositeProperty(property)) {
      this.visitCompositeProperty(name, property);
    } else if (swagger.isSimpleTypeProperty(property)) {
      this.visitSimpleTypeProperty(name, property);
    } else if (swagger.isArrayProperty(property)) {
      this.visitArrayProperty(name, property);
    } else {
      throw new Error("Unsupported property");
    }
  }

  visitEnumProperty(name: string, property: swagger.EnumProperty) {
    const context = newContext({
      property,
      typeName: name,
      enums: property.enum.map(e => ({
        enumField: e,
        enumValue: e
      }))
    });
    this.tree.push(context);
    this.tree.pop();
  }

  visitObjectProperty(name: string, property: swagger.ObjectProperty) {
    const context = newContext({
      property,
      typeName: name
    });
    this.tree.push(context);
    Object.keys(property.properties).forEach(childPropertyName =>
      this.visit(childPropertyName, property.properties[childPropertyName])
    );
    this.mergeCollectedRefs();
    this.populateImports();
    this.tree.pop();
  }

  private splitRef(ref: string): string {
    // something like #/definitions/Carrier
    const prefix = "#/definitions/";
    if (ref.startsWith(prefix)) {
      const result = ref.substring(prefix.length);
      return result;
    }
    throw new Error("Unsupported reference type " + ref);
  }

  private populateImports(): void {
    const visited: {
      [ref: string]: boolean;
    } = {};
    const visitor = (ref: string): boolean => {
      const result = visited[ref];
      if (!result) {
        visited[ref] = true;
      }
      return result;
    };
    this.context.imports = this.context.collectedRefs
      .filter(ref => !visitor(ref))
      .map(ref => ({
        typeName: ref,
        fileName: ref
      }));
  }

  visitRefProperty(name: string, property: swagger.RefProperty) {
    const type = this.splitRef(property.$ref);
    this.context.collectedRefs.push(type);
    if (swagger.isObjectProperty(this.context.property)) {
      this.context.properties.push({
        name,
        type,
        required: this.isRequired(name)
      });
    }
  }

  // eslint-disable-next-line max-lines-per-function
  visitCompositeProperty(name: string, property: swagger.CompositeProperty) {
    const context = newContext({
      property,
      typeName: name
    });
    const node = this.tree.push(context);
    property.allOf.forEach((p, idx) => this.visit(name + "." + idx, p));
    this.populateImports();
    // collect base types out of direct $ref elements on the allOf element
    context.baseTypes = context.baseTypes.concat(
      context.collectedRefs.map(ref => ({
        fileName: ref,
        typeName: ref
      }))
    );
    // collect inlined object definitions
    const contextsOfObjectProperties = node.children
      .filter(ch => swagger.isObjectProperty(ch.value.property))
      .map(ch => ch.value);
    context.properties = contextsOfObjectProperties
      .map(c => c.properties)
      .reduce((p, c) => p.concat(c), context.properties);
    this.mergeCollectedRefs();
    this.populateImports();
    this.tree.pop();
  }

  private mergeCollectedRefs(): void {
    const node = this.tree.requireNode();
    this.context.collectedRefs = node.children
      .map(c => c.value.collectedRefs)
      .reduce((p, c) => p.concat(c), this.context.collectedRefs);
  }

  isRequired(name: string): boolean {
    const parentProperty = this.context.property;
    let required = false;
    if (swagger.isObjectProperty(parentProperty)) {
      required =
        !!parentProperty.required && parentProperty.required.includes(name);
    }
    return required;
  }

  visitSimpleTypeProperty(name: string, property: swagger.TypeProperty) {
    this.context.properties.push({
      name,
      type: this.mapSimpleType(property.type),
      required: this.isRequired(name)
    });
  }

  mapSimpleType(type: string): string {
    return type === "integer" ? "number" : type;
  }

  visitArrayProperty(name: string, property: swagger.ArrayProperty) {
    const context = newContext({
      property,
      typeName: name
    });
    this.tree.push(context);
    this.visit(name + "[]", property.items);

    // TODO this only works if the array points to a $ref
    const typeName = this.context.collectedRefs[0];
    this.tree.pop();

    // Now we're in the parent context!
    if (swagger.isObjectProperty(this.context.property)) {
      this.context.properties.push({
        name,
        type: typeName + "[]",
        required: this.isRequired(name)
      });
    }
  }

  toEnumTemplate(fileName: string): templates.EnumTemplate {
    return {
      fileName,
      typeName: this.rootContext.typeName,
      enumValues: this.rootContext.enums
    };
  }

  toObjectTemplate(fileName: string): templates.ObjectTemplate {
    return {
      fileName,
      typeName: this.rootContext.typeName,
      properties: this.rootContext.properties,
      imports: this.rootContext.imports,
      baseTypes: this.rootContext.baseTypes
    };
  }

  private get context(): Context {
    return this.tree.value;
  }

  private get rootContext(): Context {
    return this.tree.rootValue;
  }
}
