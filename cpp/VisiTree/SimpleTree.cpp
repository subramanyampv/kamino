// SimpleTree.cpp: implementation of the SimpleTree class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "SimpleTree.h"

// Adds an item on the next available slot doing a breadth first search
// roots: A collection of nodes on the same level, all non-null
// length: The number of nodes in roots
void addItemNoSearch(pnode *roots, int length, key data)
{
	bool added = false;
	for (int i = 0; i < length && !added; i++)
	{
		pnode root = roots[i];

		if (root->left == NULL)
		{
			root->left = node_create(data);
			added      = true;
		}
		else if (root->right == NULL)
		{
			root->right = node_create(data);
			added       = true;
		}
		else
		{
			// continue
		}
	}

	if (!added)
	{
		// need to go one level deeper because all roots have left+right nodes
		pnode *nextLevel = new pnode[length * 2];
		for (int i = 0; i < length; i++)
		{
			nextLevel[2 * i]     = roots[i]->left;
			nextLevel[2 * i + 1] = roots[i]->right;
		}

		addItemNoSearch(nextLevel, length * 2, data);

		delete[] nextLevel;
	}
}

pnode addItemNoSearch(pnode root, key data)
{
	if (root == NULL)
	{
		root = node_create(data);
	}
	else
	{
		pnode *roots = new pnode[1];
		roots[0]     = root;
		addItemNoSearch(roots, 1, data);
		delete[] roots;
	}

	return root;
}

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

SimpleTree::SimpleTree(KeyType keyType) : AbstractTree(keyType) {}

SimpleTree::~SimpleTree() {}

void SimpleTree::Add(key data)
{
	SetRoot(addItemNoSearch(GetRoot(), data));
}
