// AVLTree.h: interface for the AVLTree class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(_AVL_TREE_H_INCLUDED_)
#define _AVL_TREE_H_INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "BinarySearchTree.h"

class AVLTree : public BinarySearchTree
{
public:
	AVLTree(KeyType keyType);
	virtual ~AVLTree();
	virtual TreeType GetTreeType() { return TreeTypeAVL; }
protected:
	virtual pnode AddNode(pnode root, key data, key_comparator keycmp);
};

#endif // !defined(_AVL_TREE_H_INCLUDED_)
