// TreeFactory.cpp: implementation of the TreeFactory class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "TreeFactory.h"
#include "BinarySearchTree.h"
#include "SimpleTree.h"
#include "AVLTree.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

TreeFactory::TreeFactory() {}

TreeFactory::~TreeFactory() {}

AbstractTree *TreeFactory::Create(TreeType treeType, KeyType keyType)
{
	AbstractTree *newTree;

	switch (treeType)
	{
		case TreeTypeSimple:
			newTree = new SimpleTree(keyType);
			break;
		case TreeTypeSearch:
			newTree = new BinarySearchTree(keyType);
			break;
		case TreeTypeAVL:
			newTree = new AVLTree(keyType);
			break;
		default:
			// show an error?
			newTree = NULL;
			break;
	}

	return newTree;
}
