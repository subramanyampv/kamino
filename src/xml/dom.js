const { SaxVisitor } = require('./sax-visitor');

class PomVersionFinder extends SaxVisitor {
  subscribe() {
    super.subscribe();
    this.result = {
      children: []
    };
  }

  onOpenTag(tag) {
    super.onOpenTag(tag);
    this.currentNode = {
      name: tag.name,
      children: [],
      parentNode: this.currentNode || this.result
    };
  }

  onText(text) {
    // ignore empty text
    if (text && text.trim()) {
      const currentNode = this.currentNode || this.result;
      currentNode.children.push(text);
    }
  }

  onCloseTag(tagName) {
    super.onCloseTag(tagName);
    this.currentNode.parentNode.children.push(this.currentNode);
    this.currentNode = this.currentNode.parentNode;
  }
}

function consolidateTextNodes(node) {
  return {
    name: node.name,
    text: node.children.filter(x => typeof x === 'string').join(''),
    children: node.children.filter(x => typeof x === 'object').map(x => consolidateTextNodes(x))
  };
}

function isArray(x) {
  return x && typeof x === 'object' && x.length;
}

function append(existingObject, newItem) {
  if (!existingObject) {
    // adding it for the first time as object
    return newItem;
  }

  if (!isArray(existingObject)) {
    // second time, not an array yet
    return [existingObject, newItem];
  }

  return existingObject.concat([newItem]);
}

function simplify(node) {
  if (!node.children.length) {
    // all text
    return node.text;
  }

  const result = {};
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    const childName = child.name;
    result[childName] = append(
      result[childName],
      simplify(child)
    );
  }

  return result;
}

async function dom(filename) {
  const pomVersionFinder = new PomVersionFinder();
  return simplify(consolidateTextNodes(await pomVersionFinder.process(filename)));
}

module.exports = dom;
