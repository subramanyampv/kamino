// BinarySearchTree.h: interface for the BinarySearchTree class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(_BINARY_SEARCH_TREE_INCLUDED_)
#define _BINARY_SEARCH_TREE_INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "AbstractTree.h"

class BinarySearchTree : public AbstractTree
{
public:
	BinarySearchTree(KeyType keyType);
	virtual ~BinarySearchTree();
	virtual void Add(key data);
	virtual TreeType GetTreeType() { return TreeTypeSearch; }
protected:
	virtual pnode AddNode(pnode root, key data, key_comparator keycmp);
};

#endif // !defined(_BINARY_SEARCH_TREE_INCLUDED_)
