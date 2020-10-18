// AbstractTree.cpp: implementation of the AbstractTree class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "AbstractTree.h"

pnode node_free(pnode root, char keyType)
{
	if (root != NULL)
	{
		node_free(root->left, keyType);
		node_free(root->right, keyType);
		if (keyType == 's')
		{
			free(root->data.s);
		}

		free(root);
	}

	return NULL;
}

void AbstractTree::Clear()
{
	root = node_free(root, keyType);
}

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

AbstractTree::AbstractTree(KeyType keyType)
{
	this->root    = NULL;
	this->keyType = keyType;
}

AbstractTree::~AbstractTree()
{
	Clear();
}
