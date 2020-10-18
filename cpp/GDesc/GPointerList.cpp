// GPointerList.cpp: implementation of the GPointerList class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "GPointerList.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

GPointerList::GPointerList()
{
	first = last = curr = NULL;
}

GPointerList::~GPointerList()
{
	Clear();
}

void GPointerList::Add(void *data)
{
	LPLIST_NODE q;
	q = (LPLIST_NODE) malloc(sizeof(LIST_NODE));
	q->info = data;
	q->next = (curr) ? curr->next : NULL;
	q->prev = (curr) ? curr : NULL;
	if (curr) curr->next = q;
	curr = q;
	if (!(q->prev)) first = curr;
	if (!(q->next)) last = curr;
}

void GPointerList::Clear()
{
	LPLIST_NODE q;
	while (first)
	{
		q = first->next;
		free(first);
		first = q;
	}
	first = last = curr = NULL;
}

void GPointerList::GotoFirst()
{
	curr = first;
}

void GPointerList::GotoNext()
{
	curr = curr->next;
}

void* GPointerList::CurrData()
{
	return (curr) ? curr->info : NULL;
}


void GPointerList::GotoLast()
{
	curr = last;
}

void GPointerList::GotoPrev()
{
	curr = curr->prev;
}
