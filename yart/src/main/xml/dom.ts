import { SaxVisitor } from './sax-visitor';

interface Node {
  name?: string;
  children: Node[];
  parentNode?: Node;
  text: string;
}

class PomVersionFinder extends SaxVisitor<Node> {
  private currentNode: Node;

  subscribe(): void {
    super.subscribe();
    this.result = {
      children: [],
      text: ''
    };
  }

  onOpenTag(tag): void {
    super.onOpenTag(tag);
    this.currentNode = {
      name: tag.name,
      children: [],
      parentNode: this.currentNode || this.result,
      text: ''
    };
  }

  onText(text): void {
    // Ignore empty text
    if (text && text.trim()) {
      const currentNode = this.currentNode || this.result;
      currentNode.text = currentNode.text + text;
    }
  }

  onCloseTag(tagName): void {
    super.onCloseTag(tagName);
    this.currentNode.parentNode.children.push(this.currentNode);
    this.currentNode = this.currentNode.parentNode;
  }
}

function isArray(obj): obj is object[] {
  return obj && typeof obj === 'object' && obj.length;
}

function append(
  existingObject: object | object[],
  newItem: string | object
): string | object | object[] {
  if (!existingObject) {
    // Adding it for the first time as object
    return newItem;
  }

  if (!isArray(existingObject)) {
    // Second time, not an array yet
    return [
      existingObject,
      newItem
    ];
  }

  return existingObject.concat([newItem]);
}

function simplify(node: Node): string | object {
  if (!node.children.length) {
    // All text
    return node.text;
  }

  const result = {};
  node.children.forEach(child => {
    const childName = child.name;
    result[childName] = append(
      result[childName],
      simplify(child)
    );
  });

  return result;
}

export async function dom(filename: string): Promise<string | object> {
  const pomVersionFinder = new PomVersionFinder();
  const processed = await pomVersionFinder.process(filename);
  return simplify(processed);
}
