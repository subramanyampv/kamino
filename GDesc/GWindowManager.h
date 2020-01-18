// GWindowManager.h: interface for the GWindowManager class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_GWINDOWMANAGER_H__E6372241_9C86_11D3_B5B1_CE7AA7E84C79__INCLUDED_)
#define AFX_GWINDOWMANAGER_H__E6372241_9C86_11D3_B5B1_CE7AA7E84C79__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "GPointerList.h"
#include "GWindow.h"

class GWindowManager : public GPointerList  
{
public:
	GWindow* WindowFromPoint(int x, int y);
	GWindow* GetActiveWindow();
	GWindow* Add(LPCTSTR szCaption, int left, int top, int width, int height);
	GWindowManager();
	virtual ~GWindowManager();

};

#endif // !defined(AFX_GWINDOWMANAGER_H__E6372241_9C86_11D3_B5B1_CE7AA7E84C79__INCLUDED_)
