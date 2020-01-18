// PropertyPageDialog.cpp: implementation of the CPropertyPageDialog class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "PropertyPageDialog.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

CPropertyPageDialog::CPropertyPageDialog()
{

}

CPropertyPageDialog::~CPropertyPageDialog()
{
}

LRESULT CPropertyPageDialog::dialogProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	LRESULT ret=0;
	CObjectWindow* obj = objectFromDialog(hWnd);
	if (msg == WM_INITDIALOG)
	{
		obj = (CObjectWindow*) ((PROPSHEETPAGE*)lParam)->lParam;
		obj->attatchToDialog(hWnd);
		obj->hWnd = hWnd;
	}
	if (obj != NULL)
		ret = obj->Handler(msg, wParam, lParam);
	if (msg == WM_DESTROY)
	{
		delete obj;
		SetWindowLongPtr(hWnd, DWLP_USER, 0);
	}
	return ret;
}
