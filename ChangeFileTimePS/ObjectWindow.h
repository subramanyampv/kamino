// ObjectWindow.h: interface for the CObjectWindow class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_OBJECTWINDOW_H__66D201E0_A3FC_4F3C_A0A5_8ED2973D98A6__INCLUDED_)
#define AFX_OBJECTWINDOW_H__66D201E0_A3FC_4F3C_A0A5_8ED2973D98A6__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

class CObjectWindow  
{
public:
	virtual LRESULT Handler(UINT msg, WPARAM wParam, LPARAM lParam);
	HWND hWnd;
	static LRESULT CALLBACK dialogProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam);
	static CObjectWindow* objectFromDialog(HWND hWnd);
	void attatchToDialog(HWND hWnd);
	CObjectWindow();
	virtual ~CObjectWindow();

};

#endif // !defined(AFX_OBJECTWINDOW_H__66D201E0_A3FC_4F3C_A0A5_8ED2973D98A6__INCLUDED_)
