// Node.cpp: implementation of the Node class.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "Node.h"

pnode node_create(key data)
{
	pnode root = (pnode)malloc(sizeof(node));
	root->data = data;
	root->left = root->right = NULL;
	return root;
}

int keycmp_char(key x, key y)
{
	return (x.c == y.c) ? 0 : ((x.c > y.c) ? 1 : -1);
}

int keycmp_int(key x, key y)
{
	return x.i - y.i;
}

int keycmp_float(key x, key y)
{
	return ((x.f == y.f) ? 0 : ((x.f > y.f) ? 1 : -1));
}

int keycmp_string(key x, key y)
{
	return _tcscmp(x.s, y.s);
}

key_comparator get_key_comparator(KeyType keyType)
{
	switch (keyType)
	{
		case KeyTypeChar:
			return keycmp_char;
		case KeyTypeInteger:
			return keycmp_int;
		case KeyTypeFloat:
			return keycmp_float;
		case KeyTypeString:
			return keycmp_string;
		default:
			return NULL;
	}
}

int node_height(pnode node)
{
	if (node == NULL)
	{
		return 0;
	}

	return 1 + max(node_height(node->left), node_height(node->right));
}

int node_balance_factor(pnode node)
{
	if (node == NULL)
	{
		return 0;
	}

	return node_height(node->right) - node_height(node->left);
}
