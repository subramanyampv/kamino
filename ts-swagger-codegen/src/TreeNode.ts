export interface TreeNode<T> {
  children: TreeNode<T>[];
  value: T;
  parent?: TreeNode<T>;
}

function push<T>(
  parent: TreeNode<T> | undefined,
  value: T
): TreeNode<T> {
  const newNode: TreeNode<T> = {
    value,
    parent,
    children: []
  };

  if (parent) {
    parent.children.push(newNode);
  }

  return newNode;
}

export class Tree<T> {
  private root?: TreeNode<T>;
  private node?: TreeNode<T>;

  push(value: T): TreeNode<T> {
    const newNode = push(this.node, value);
    this.node = newNode;
    if (!this.root) {
      this.root = newNode;
    }

    return newNode;
  }

  public requireNode(): TreeNode<T> {
    if (!this.node) {
      throw new Error("Stack is empty");
    }
    return this.node;
  }

  public requireRootNode(): TreeNode<T> {
    if (!this.root) {
      throw new Error("Stack is empty");
    }
    return this.root;
  }

  public pop(): T {
    const node = this.requireNode();
    const result = node.value;
    this.node = node.parent;
    return result;
  }

  public get value(): T {
    return this.requireNode().value;
  }

  public get rootValue(): T {
    return this.requireRootNode().value;
  }
}
