// AbstractTree.h: interface for the AbstractTree class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(_ABSTRACT_TREE_H_INCLUDED_)
#define _ABSTRACT_TREE_H_INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "Node.h"

enum TreeType
{
	TreeTypeSearch = 1,
	TreeTypeSimple = 2,
	TreeTypeAVL    = 3
};

class AbstractTree
{
public:
	AbstractTree(KeyType keyType);
	virtual ~AbstractTree();
	void Clear();
	virtual void Add(key data) = 0;
	KeyType GetKeyType() { return keyType; }
	virtual TreeType GetTreeType() = 0;
	pnode GetRoot() { return root; }

protected:
	void SetRoot(pnode node) { root = node; }

private:
	pnode root;
	KeyType keyType;
};

#endif // !defined(_ABSTRACT_TREE_H_INCLUDED_)
