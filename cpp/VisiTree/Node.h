// Node.h: interface for the Node class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_NODE_H__8241A4F3_E493_4786_AD32_C83D88CC0EBD__INCLUDED_)
#define AFX_NODE_H__8241A4F3_E493_4786_AD32_C83D88CC0EBD__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

typedef union key {
	int i;
	TCHAR c;
	LPTSTR s;
	float f;
} key;

typedef struct node
{
	key data;
	struct node *left, *right;
} node, *pnode;

enum KeyType
{
	KeyTypeInteger = 1,
	KeyTypeFloat   = 2,
	KeyTypeChar    = 4,
	KeyTypeString  = 8
};

pnode node_create(key data);

typedef int (*key_comparator)(key, key);

key_comparator get_key_comparator(KeyType keyType);

int node_height(pnode node);

int node_balance_factor(pnode node);

#endif // !defined(AFX_NODE_H__8241A4F3_E493_4786_AD32_C83D88CC0EBD__INCLUDED_)
