#if !defined ABSTRACT_DIALOG_H
#define ABSTRACT_DIALOG_H
#include "StdAfx.h"
#include "App.h"
#include "MessageHandlers.h"

/**
 * Base class for dialogs.
 */
class AbstractDialog
{
private:
	App &m_app;
	LPCTSTR m_templateName;
	HWND m_wnd;

public:
	AbstractDialog(App &app, LPCTSTR templateName);
	virtual ~AbstractDialog();
	virtual LRESULT WndProc(UINT, WPARAM, LPARAM) = 0;
	DialogMessageHandler *CreateDialogMessageHandler();

	/**
	 * Creates the dialog.
	 * The HWND of the dialog is created in this method.
	 */
	void Create();

	/**
	 * Shows the dialog.
	 */
	void Show();

	HWND GetWnd();

	void SetWnd(HWND hWnd);

	BOOL MoveChildWindow(int nIDDlgItem,
						 int X,
						 int Y,
						 int nWidth,
						 int nHeight,
						 BOOL bRepaint = TRUE);

	App &GetApp() { return m_app; }
};

#endif
