// BinarySearchTree.cpp: implementation of the BinarySearchTree class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "BinarySearchTree.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

BinarySearchTree::BinarySearchTree(KeyType keyType) : AbstractTree(keyType) {}

BinarySearchTree::~BinarySearchTree() {}

void BinarySearchTree::Add(key data)
{
	SetRoot(AddNode(GetRoot(), data, get_key_comparator(GetKeyType())));
}

pnode BinarySearchTree::AddNode(pnode root, key data, key_comparator keycmp)
{
	if (root == NULL)
	{
		root = node_create(data);
	}
	else if (keycmp(data, root->data) < 0)
	{
		root->left = AddNode(root->left, data, keycmp);
	}
	else if (keycmp(data, root->data) > 0)
	{
		root->right = AddNode(root->right, data, keycmp);
	}

	return root;
}
