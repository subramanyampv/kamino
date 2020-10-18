// Instance.cpp: initializing the application instance.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "App.h"
#include "resource.h"

#define MYCLASSNAME _T("VISITREECLASS")

App *App::m_appInstance = NULL;

App::App(HINSTANCE hInstance) : m_instance(hInstance)
{
	m_messageHandler.Add(new DefaultMessageHandler());
	MyRegisterClass(hInstance);
	m_appInstance = this;
}

App::~App() {}

WPARAM App::Run()
{
	MSG msg;
	while (GetMessage(&msg, 0, 0, 0))
	{
		m_messageHandler.Handle(&msg);
	}

	return msg.wParam;
}

//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
//  COMMENTS:
//
//    This function and its usage is only necessary if you want this code
//    to be compatible with Win32 systems prior to the 'RegisterClassEx'
//    function that was added to Windows 95. It is important to call this
//    function so that the application will get 'well formed' small icons
//    associated with it.
//
ATOM App::MyRegisterClass(HINSTANCE hInstance)
{
	WNDCLASSEX wcex;

	wcex.cbSize        = sizeof(WNDCLASSEX);
	wcex.style         = CS_HREDRAW | CS_VREDRAW;
	wcex.lpfnWndProc   = (WNDPROC)DefDlgProc;
	wcex.cbClsExtra    = 0;
	wcex.cbWndExtra    = DLGWINDOWEXTRA;
	wcex.hInstance     = hInstance;
	wcex.hIcon         = LoadIcon(hInstance, (LPCTSTR)IDI_VISITREE);
	wcex.hCursor       = LoadCursor(NULL, IDC_ARROW);
	wcex.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
	wcex.lpszMenuName  = (LPCTSTR)IDC_VISITREE;
	wcex.lpszClassName = MYCLASSNAME;
	wcex.hIconSm       = LoadIcon(wcex.hInstance, (LPCTSTR)IDI_SMALL);

	return RegisterClassEx(&wcex);
}
