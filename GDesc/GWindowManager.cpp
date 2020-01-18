// GWindowManager.cpp: implementation of the GWindowManager class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "GWindowManager.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

GWindowManager::GWindowManager()
{

}

GWindowManager::~GWindowManager()
{
	GotoFirst();
	while (CurrData())
	{
		delete ((GWindow *) CurrData());
		GotoNext();
	}
}

GWindow* GWindowManager::Add(LPCTSTR szCaption, int left, int top, int width, int height)
{
	GWindow* wnd1;
	wnd1 = new GWindow();
	wnd1->SetBounds(left, top, width, height);
	wnd1->SetCaption(szCaption);
	GPointerList::Add((void *) wnd1);
	return wnd1;
}

GWindow* GWindowManager::GetActiveWindow()
{
	BOOL f1 = TRUE;
	GotoFirst();

	while (CurrData() && !(((GWindow*) CurrData())->GetWindowState() & WS_ACTIVE))
		GotoNext();
	return (GWindow *) CurrData();
}

GWindow* GWindowManager::WindowFromPoint(int x, int y)
{
	GotoLast();
	while (CurrData() && (((GWindow*) CurrData())->HitTest(x, y) == HT_OUTSIDE))
		GotoPrev();
	return (GWindow *) CurrData();
}
