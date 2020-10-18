// SimpleTree.h: interface for the SimpleTree class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_SIMPLETREE_H__5611D6D6_A746_4E03_91C2_AD99CF9494CE__INCLUDED_)
#define AFX_SIMPLETREE_H__5611D6D6_A746_4E03_91C2_AD99CF9494CE__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "AbstractTree.h"

class SimpleTree : public AbstractTree
{
public:
	SimpleTree(KeyType keyType);
	virtual ~SimpleTree();
	virtual void Add(key data);
	virtual TreeType GetTreeType() { return TreeTypeSimple; }
};

#endif // !defined(AFX_SIMPLETREE_H__5611D6D6_A746_4E03_91C2_AD99CF9494CE__INCLUDED_)
