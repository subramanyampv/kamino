// GWindow.h: interface for the GWindow class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_GWINDOW_H__55EAE44C_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
#define AFX_GWINDOW_H__55EAE44C_9C6A_11D3_B5B1_D2158548A178__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "GAbstractCanvas.h"

#define WS_ACTIVE 1

#define HT_OUTSIDE 0
#define HT_CLIENT 1

class GWindow  
{
private:
	LPTSTR FCaption;
	int FLeft, FTop, FWidth, FHeight;
	long FState;
public:
	LONG HitTest(int x, int y);
	void SetBounds(int left, int top, int width, int height);
	void SetCaption(LPCTSTR szText);
	LPTSTR GetCaption();
	virtual void Paint(GAbstractCanvas *canvas);
	GWindow();
	virtual ~GWindow();
	void GetWindowRect(LPRECT lpRect);
	long GetWindowState();
	void SetWindowState(long newState);
};

#endif // !defined(AFX_GWINDOW_H__55EAE44C_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
