// GPointerList.h: interface for the GPointerList class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_GPOINTERLIST_H__55EAE44F_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
#define AFX_GPOINTERLIST_H__55EAE44F_9C6A_11D3_B5B1_D2158548A178__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

typedef struct tagListNode *LPLIST_NODE;
typedef struct tagListNode {
	void* info;
	LPLIST_NODE prev, next;
} LIST_NODE;
	
class GPointerList  
{
private:
	LPLIST_NODE first, last, curr;
public:
	void GotoPrev();
	void GotoLast();
	void Clear();
	void Add(void* data);
	void GotoFirst();
	void GotoNext();
	void* CurrData();
	GPointerList();
	virtual ~GPointerList();

};

#endif // !defined(AFX_GPOINTERLIST_H__55EAE44F_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
