#include "AbstractDialog.h"
#include <exception>

LRESULT CALLBACK StaticWndProc(HWND hWnd,
							   UINT message,
							   WPARAM wParam,
							   LPARAM lParam)
{
	AbstractDialog *dialog;
	switch (message)
	{
		case WM_INITDIALOG:
			SetWindowLongPtr(hWnd, GWLP_USERDATA, lParam);
			dialog = (AbstractDialog *)lParam;
			dialog->SetWnd(hWnd);
			return dialog->WndProc(message, wParam, lParam);
		default:
			dialog = (AbstractDialog *)GetWindowLongPtr(hWnd, GWLP_USERDATA);
			if (dialog)
			{
				return dialog->WndProc(message, wParam, lParam);
			}

			return 0;
	}
}

AbstractDialog::AbstractDialog(App &app, LPCTSTR templateName)
	: m_app(app), m_templateName(templateName), m_wnd(NULL)
{
}

AbstractDialog::~AbstractDialog() {}

DialogMessageHandler *AbstractDialog::CreateDialogMessageHandler()
{
	return new DialogMessageHandler(m_wnd);
}

void AbstractDialog::Create()
{
	m_wnd = CreateDialogParam(m_app.Instance(),
							  m_templateName,
							  0,
							  (DLGPROC)StaticWndProc,
							  (LPARAM)this);
}

void AbstractDialog::Show()
{
	ShowWindow(m_wnd, SW_SHOWNORMAL);
}

HWND AbstractDialog::GetWnd()
{
	if (!m_wnd)
	{
		throw std::exception("HWND not set");
	}

	return m_wnd;
}

void AbstractDialog::SetWnd(HWND hWnd)
{
	if (m_wnd)
	{
		throw std::exception("HWND already set");
	}

	m_wnd = hWnd;
}

BOOL AbstractDialog::MoveChildWindow(int nIDDlgItem,
									 int X,
									 int Y,
									 int nWidth,
									 int nHeight,
									 BOOL bRepaint)
{
	HWND hChildWnd = GetDlgItem(m_wnd, nIDDlgItem);
	return MoveWindow(hChildWnd, X, Y, nWidth, nHeight, bRepaint);
}
