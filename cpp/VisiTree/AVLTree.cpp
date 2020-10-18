// AVLTree.cpp: implementation of the AVLTree class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "AVLTree.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

AVLTree::AVLTree(KeyType keyType) : BinarySearchTree(keyType) {}

AVLTree::~AVLTree() {}

pnode AVLTree::AddNode(pnode root, key data, key_comparator keycmp)
{
	root = BinarySearchTree::AddNode(root, data, keycmp);
	int root_bf = node_balance_factor(root);

	if (root_bf >= 2 || root_bf <= -2)
	{
		// we are out of balance

		// 	Right Right 	=> Z is a right child of its parent X and 	Z is
		// not left-heavy 	(i.e. BalanceFactor(Z) ≥ 0)
		int bf = node_balance_factor(root->right);
		if (bf >= 0)
		{
			pnode z = root->right;
			pnode t23 = z->left;
			root->right = t23;
			z->left = root;
			return z;
		}
	}

	return root;
}
