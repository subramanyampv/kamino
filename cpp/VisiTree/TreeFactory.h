// TreeFactory.h: interface for the TreeFactory class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_TREEFACTORY_H__16C2C36F_85BB_4FEE_86EE_34D0F3816633__INCLUDED_)
#define AFX_TREEFACTORY_H__16C2C36F_85BB_4FEE_86EE_34D0F3816633__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "AbstractTree.h"

class TreeFactory
{
public:
	TreeFactory();
	virtual ~TreeFactory();
	AbstractTree *Create(TreeType treeType, KeyType keyType);
};

#endif // !defined(AFX_TREEFACTORY_H__16C2C36F_85BB_4FEE_86EE_34D0F3816633__INCLUDED_)
