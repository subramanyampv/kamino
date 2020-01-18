// ObjectWindow.cpp: implementation of the CObjectWindow class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "ObjectWindow.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

CObjectWindow::CObjectWindow()
{

}

CObjectWindow::~CObjectWindow()
{

}

void CObjectWindow::attatchToDialog(HWND hWnd)
{
	SetWindowLongPtr(hWnd, DWLP_USER, (LONG) this);
}

CObjectWindow* CObjectWindow::objectFromDialog(HWND hWnd)
{
	return (CObjectWindow*) GetWindowLongPtr(hWnd, DWLP_USER);
}

LRESULT CObjectWindow::dialogProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	CObjectWindow* obj = objectFromDialog(hWnd);
	if (msg == WM_CREATE)
	{
		obj = (CObjectWindow*) lParam;
		obj->attatchToDialog(hWnd);
		obj->hWnd = hWnd;
	}
	if (obj != NULL)
		return obj->Handler(msg, wParam, lParam);
	return 0;
}

LRESULT CObjectWindow::Handler(UINT msg, WPARAM wParam, LPARAM lParam)
{
	return 0;
}
