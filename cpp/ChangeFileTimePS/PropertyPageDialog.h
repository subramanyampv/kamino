// PropertyPageDialog.h: interface for the CPropertyPageDialog class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_PROPERTYPAGEDIALOG_H__2F92E782_3B44_4ABF_8A67_546D98C18C08__INCLUDED_)
#define AFX_PROPERTYPAGEDIALOG_H__2F92E782_3B44_4ABF_8A67_546D98C18C08__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "ObjectWindow.h"

class CPropertyPageDialog : public CObjectWindow  
{
public:
	CPropertyPageDialog();
	virtual ~CPropertyPageDialog();
	static LRESULT CALLBACK dialogProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam);
};

#endif // !defined(AFX_PROPERTYPAGEDIALOG_H__2F92E782_3B44_4ABF_8A67_546D98C18C08__INCLUDED_)
