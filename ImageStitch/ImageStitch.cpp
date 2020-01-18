// ImageStitch.cpp : Defines the entry point for the application.
//

#include "stdafx.h"
#include "resource.h"

#define ID_TOOLBAR 500
#define ID_CMD_NEW_FILE 501
#define ID_CMD_OPEN_FILE 502
#define ID_CMD_SAVE_FILE 503

#define DECLARE_MSG_CRACK_RET(Name) LPARAM Name(HWND hWnd, WPARAM wParam, LPARAM lParam)
#define DECLARE_MSG_CRACK(Name) void Name(HWND hWnd, WPARAM wParam, LPARAM lParam)
#define MSG_CRACK_RET(MsgName, ProcName) case MsgName: return ProcName(hWnd, wParam, lParam);
#define MSG_CRACK(MsgName, ProcName) case MsgName: ProcName(hWnd, wParam, lParam); break;

HINSTANCE hInst;

typedef struct ListEntry {
	TCHAR szPath[MAX_PATH];
	HBITMAP hBitmap;
} ListEntry;

void DoOpenFile(HWND hWnd, LPCTSTR szFileName);

DECLARE_MSG_CRACK_RET(OnInitDialog)
{
	TBBUTTON tbb[3];

	SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_SETCOLUMNWIDTH, 32, 0);
	SetDlgItemInt(hWnd, ID_TXT_IMG_WIDTH, 16, FALSE);
	SetDlgItemInt(hWnd, ID_TXT_IMG_HEIGHT, 16, FALSE);

	ZeroMemory(tbb, sizeof(tbb));
	tbb[0].iBitmap = 0;
	tbb[0].idCommand = ID_CMD_NEW_FILE;
	tbb[0].fsState = TBSTATE_ENABLED;
	tbb[0].fsStyle = TBSTYLE_BUTTON;

	tbb[1].iBitmap = 1;
	tbb[1].idCommand = ID_CMD_OPEN_FILE;
	tbb[1].fsState = TBSTATE_ENABLED;
	tbb[1].fsStyle = TBSTYLE_BUTTON;

	tbb[2].iBitmap = 2;
	tbb[2].idCommand = ID_CMD_SAVE_FILE;
	tbb[2].fsState = TBSTATE_ENABLED;
	tbb[2].fsStyle = TBSTYLE_BUTTON;

	CreateToolbarEx(hWnd, WS_CHILD | WS_VISIBLE, ID_TOOLBAR, 3 /* number of bitmaps */,
		hInst, IDB_TOOLBAR, tbb, 3 /* number of buttons */, 1, 0, 16, 16, sizeof(TBBUTTON));

	return 1;
}

DECLARE_MSG_CRACK(OnClose)
{
	EndDialog(hWnd, 0);
}

void Refresh(HWND hWnd)
{
	InvalidateRect(hWnd, NULL, TRUE);
}

void DoAddFile(HWND hWnd, LPCTSTR szFileName, LPCTSTR szPathName=NULL)
{
	ListEntry* le;
	le = new ListEntry;
	if (szPathName != NULL)
	{
		lstrcpy(le->szPath, szPathName);
		if (szPathName[lstrlen(szPathName)-1] != '\\')
			lstrcat(le->szPath, _T("\\"));
		lstrcat(le->szPath, szFileName);
	}
	else
		lstrcpy(le->szPath, szFileName);
	le->hBitmap = (HBITMAP) LoadImage(0, le->szPath, IMAGE_BITMAP, 0, 0, LR_LOADFROMFILE);

	SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_ADDSTRING, 0, (LPARAM) le);
}

void OnCmdAdd(HWND hWnd)
{
	OPENFILENAME of;
	TCHAR szFilter[MAX_PATH];
	TCHAR szFileName[MAX_PATH];
	LPTSTR p;

	// set filter string
	LoadString(hInst, IDS_OPEN_IMAGE_FILTER, szFilter, MAX_PATH);
	for (p = szFilter; *p != '\0'; p++)
		if (*p == '|') *p = '\0';
	*(++p) = '\0';

	// set file name to null
	szFileName[0] = '\0';

	// fill in OPENFILENAME structure
	ZeroMemory(&of, sizeof(OPENFILENAME));
	of.lStructSize = sizeof(OPENFILENAME);
	of.hwndOwner = hWnd;
	of.hInstance = hInst;
	of.lpstrFilter = szFilter;
	of.nFilterIndex = 1;
	of.lpstrFile = szFileName;
	of.nMaxFile = MAX_PATH;
	of.Flags = OFN_ALLOWMULTISELECT | OFN_EXPLORER | OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST | OFN_HIDEREADONLY;

	if (GetOpenFileName(&of))
	{
		if (of.nFileOffset > lstrlen(of.lpstrFile))
		{
			// multiple files
			int nCount = 0;
			LPTSTR q;

			p = szFileName;

			do
			{
				q = p; // save start
				while (*p != '\0')
					p++;
				if (q != p)
				{
					nCount++;
					if (nCount >= 2)
						DoAddFile(hWnd, q, szFileName);
					p++;
				}
			} while (q != p);
		}
		else
		{
			// single file
			DoAddFile(hWnd, szFileName);
		}
		Refresh(hWnd);
	}
}

void OnCmdRemove(HWND hWnd)
{
	int nSel = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETCURSEL, 0, 0);
	if (nSel >= 0)
	{
		SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_DELETESTRING, nSel, 0);
		Refresh(hWnd);
	}
}

void OnCmdMoveLeft(HWND hWnd, int pos)
{
	int nSel = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETCURSEL, 0, 0);
	if (nSel >=0 )
	{
		DWORD a, b;
		int newSel, count = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETCOUNT, 0, 0);
		newSel = (nSel + count + pos) % count;

		a = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETITEMDATA, nSel, 0);
		b = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETITEMDATA, newSel, 0);

		SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_SETITEMDATA, nSel, b);
		SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_SETITEMDATA, newSel, a);

		SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_SETCURSEL, newSel, 0);

		Refresh(hWnd);
	}
}

void OnCmdNewFile(HWND hWnd)
{
	SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_RESETCONTENT, 0, 0);
	Refresh(hWnd);
}

void DoOpenFile(HWND hWnd, LPCTSTR szFileName)
{
	FILE *fp;
	TCHAR buf[MAX_PATH];
	LPTSTR p;

	buf[0] = '\0';
	lstrcpy(buf, szFileName);
	if (buf[0] == '"' && buf[lstrlen(buf)-1] == '"')
	{
		buf[lstrlen(buf)-1] = '\0';
		p=buf + 1;
	}
	else
		p = buf;

	_tfopen_s(&fp, p, _T("rt"));
	SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_RESETCONTENT, 0, 0);
	while (	_fgetts(buf, MAX_PATH, fp) != NULL )
	{
		if ((p = _tcsrchr(buf, '\n')) != NULL)
			*p = '\0';
			
		DoAddFile(hWnd, buf);
	}
	fclose(fp);
	Refresh(hWnd);
}

void OnCmdOpenFile(HWND hWnd)
{
	OPENFILENAME of;
	TCHAR szFilter[MAX_PATH];
	TCHAR szFileName[MAX_PATH];
	TCHAR szDefExt[4];
	LPTSTR p;

	// set filter string
	LoadString(hInst, IDS_OPEN_FILTER, szFilter, MAX_PATH);
	for (p = szFilter; *p != '\0'; p++)
		if (*p == '|') *p = '\0';
	*(++p) = '\0';

	// set file name to null
	szFileName[0] = '\0';

	// load default extention
	LoadString(hInst, IDS_DEF_EXT, szDefExt, 3);

	// fill in OPENFILENAME structure
	ZeroMemory(&of, sizeof(OPENFILENAME));
	of.lStructSize = sizeof(OPENFILENAME);
	of.hwndOwner = hWnd;
	of.hInstance = hInst;
	of.lpstrFilter = szFilter;
	of.nFilterIndex = 1;
	of.lpstrFile = szFileName;
	of.nMaxFile = MAX_PATH;
	of.lpstrDefExt = szDefExt;
	of.Flags = OFN_EXPLORER | OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST | OFN_HIDEREADONLY;

	if (GetOpenFileName(&of))
	{
		DoOpenFile(hWnd, szFileName);
	}
}

void DoSaveFile(HWND hWnd, LPCTSTR szFileName)
{
	FILE *fp;
	_tfopen_s(&fp, szFileName, _T("wt"));
	int i, count = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETCOUNT, 0, 0);
	for (i = 0; i < count; i++)
	{
		ListEntry* le = (ListEntry*) SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETITEMDATA, i, 0);
		_ftprintf_s(fp, _T("%s\n"), le->szPath);
	}
	fclose(fp);
}

void OnCmdSaveFile(HWND hWnd)
{
	OPENFILENAME of;
	TCHAR szFilter[MAX_PATH];
	TCHAR szFileName[MAX_PATH];
	TCHAR szDefExt[4];
	LPTSTR p;

	// set filter string
	LoadString(hInst, IDS_OPEN_FILTER, szFilter, MAX_PATH);
	for (p = szFilter; *p != '\0'; p++)
		if (*p == '|') *p = '\0';
	*(++p) = '\0';

	// set file name to null
	szFileName[0] = '\0';

	// load default extention
	LoadString(hInst, IDS_DEF_EXT, szDefExt, 3);

	// fill in OPENFILENAME structure
	ZeroMemory(&of, sizeof(OPENFILENAME));
	of.lStructSize = sizeof(OPENFILENAME);
	of.hwndOwner = hWnd;
	of.hInstance = hInst;
	of.lpstrFilter = szFilter;
	of.nFilterIndex = 1;
	of.lpstrFile = szFileName;
	of.nMaxFile = MAX_PATH;
	of.lpstrDefExt = szDefExt;
	of.Flags = OFN_EXPLORER | OFN_OVERWRITEPROMPT | OFN_HIDEREADONLY;

	if (GetSaveFileName(&of))
	{
		DoSaveFile(hWnd, szFileName);
	}
}

DECLARE_MSG_CRACK(OnCommand)
{
	WORD wNotifyCode = HIWORD(wParam); // notification code
	WORD wID = LOWORD(wParam);         // item, control, or accelerator identifier
	HWND hwndCtl = (HWND) lParam;      // handle of control

	switch (wID)
	{
		case ID_CMD_ADD:
			OnCmdAdd(hWnd);
			break;
		case ID_CMD_REMOVE:
			OnCmdRemove(hWnd);
			break;
		case ID_CMD_MOVE_LEFT:
			OnCmdMoveLeft(hWnd, -1);
			break;
		case ID_CMD_MOVE_RIGHT:
			OnCmdMoveLeft(hWnd, 1);
			break;
		case ID_CMD_NEW_FILE:
			OnCmdNewFile(hWnd);
			break;
		case ID_CMD_OPEN_FILE:
			OnCmdOpenFile(hWnd);
			break;
		case ID_CMD_SAVE_FILE:
			OnCmdSaveFile(hWnd);
			break;
	}
}

DECLARE_MSG_CRACK(OnDeleteItem)
{
	int idCtl = wParam;                      // control identifier
	LPDELETEITEMSTRUCT lpdis = (LPDELETEITEMSTRUCT) lParam; // structure with item information
	if (lpdis->CtlID == ID_LST_ICONS)
	{
		ListEntry* le = (ListEntry*) lpdis->itemData;
		if (le != NULL)
		{
			if (le->hBitmap != NULL)
				DeleteObject(le->hBitmap);
			delete le;
		}
	}
}

DECLARE_MSG_CRACK(OnDrawItem)
{
	LPDRAWITEMSTRUCT lpdis = (LPDRAWITEMSTRUCT) lParam;
	ListEntry* le = (ListEntry*) lpdis->itemData;

	FillRect(lpdis->hDC, &lpdis->rcItem, (HBRUSH)(1 + (lpdis->itemState & ODS_SELECTED ? COLOR_HIGHLIGHT : COLOR_WINDOW)));

	if ((signed int) lpdis->itemID >= 0 && lpdis->itemData != NULL)
	{

		HDC hMemDC = CreateCompatibleDC(0);
		HBITMAP hOldBmp = (HBITMAP) SelectObject(hMemDC, le->hBitmap);
		BITMAP bmp;
		GetObject(le->hBitmap, sizeof(BITMAP), &bmp);

		SIZE vp;
		RECT rt;
		vp.cx = lpdis->rcItem.right - lpdis->rcItem.left;
		vp.cy = lpdis->rcItem.bottom - lpdis->rcItem.top;
		rt.left = rt.top = 0;
		if (bmp.bmWidth > bmp.bmHeight)
		{
			if (bmp.bmWidth > vp.cx)
			{
				rt.right = vp.cx;
				rt.bottom = (bmp.bmHeight * vp.cx)/bmp.bmWidth;
			}
			else
			{
				rt.right = bmp.bmWidth; // set to vp.cx for left justify
				rt.bottom = bmp.bmHeight;
			}
		}
		else
		{
			if (bmp.bmHeight > vp.cy)
			{
				rt.bottom = vp.cy;
				rt.right = (bmp.bmWidth * vp.cy)/bmp.bmHeight;
			}
			else
			{
				rt.right = bmp.bmWidth;
				rt.bottom = bmp.bmHeight;
			}
		}

		OffsetRect(&rt, (lpdis->rcItem.left + lpdis->rcItem.right - rt.right)/2,
			(lpdis->rcItem.top + lpdis->rcItem.bottom - rt.bottom)/2);


		StretchBlt(lpdis->hDC,
			rt.left, rt.top,
			rt.right - rt.left, rt.bottom - rt.top,
			hMemDC, 0, 0, bmp.bmWidth, bmp.bmHeight, SRCCOPY);

		DeleteDC(hMemDC);
	}
}

DECLARE_MSG_CRACK(OnMeasureItem)
{
	LPMEASUREITEMSTRUCT lpmis = (LPMEASUREITEMSTRUCT) lParam;
	RECT rt;
	GetClientRect(GetDlgItem(hWnd, ID_LST_ICONS), &rt);
	lpmis->itemHeight = rt.bottom;
}

DECLARE_MSG_CRACK(OnPaint)
{
	PAINTSTRUCT ps;
	RECT clientRt;
	SIZE imgSz;
	int x, y, i, count;
	BOOL success;

	BeginPaint(hWnd, &ps);

	imgSz.cx = GetDlgItemInt(hWnd, ID_TXT_IMG_WIDTH, &success, FALSE);
	if (success)
	{
		imgSz.cy = GetDlgItemInt(hWnd, ID_TXT_IMG_HEIGHT, &success, FALSE);
		if (success)
		{
			if ((count = SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETCOUNT, 0, 0)) > 0)
			{
				GetClientRect(hWnd, &clientRt);

				y = clientRt.bottom - 2 - imgSz.cy;
				x = 2;
				HDC hMemDC = CreateCompatibleDC(0);
				BITMAP bmp;
				ListEntry* le;

				for (i = 0; i < count; i++, x+=imgSz.cx)
				{
					le = (ListEntry*) SendDlgItemMessage(hWnd, ID_LST_ICONS, LB_GETITEMDATA, i, 0);
					if (le != NULL && le->hBitmap != NULL)
					{
						SelectObject(hMemDC, le->hBitmap);
						GetObject(le->hBitmap, sizeof(BITMAP), &bmp);
						RECT rt;
						rt.left = rt.top = 0;
						if (bmp.bmWidth > bmp.bmHeight)
						{
							if (bmp.bmWidth > imgSz.cx)
							{
								rt.right = imgSz.cx;
								rt.bottom = (bmp.bmHeight * imgSz.cx)/bmp.bmWidth;
							}
							else
							{
								rt.right = bmp.bmWidth; // set to imgSz.cx for left justify
								rt.bottom = bmp.bmHeight;
							}
						}
						else
						{
							if (bmp.bmHeight > imgSz.cy)
							{
								rt.bottom = imgSz.cy;
								rt.right = (bmp.bmWidth * imgSz.cy)/bmp.bmHeight;
							}
							else
							{
								rt.right = bmp.bmWidth;
								rt.bottom = bmp.bmHeight;
							}
						}

						OffsetRect(&rt, x + (imgSz.cx - rt.right)/2,
							y + (imgSz.cy - rt.bottom)/2);
						StretchBlt(ps.hdc,
							rt.left, rt.top,
							rt.right - rt.left, rt.bottom - rt.top,
							hMemDC, 0, 0, bmp.bmWidth, bmp.bmHeight, SRCCOPY);

					}
				} /* end of for loop */
				DeleteDC(hMemDC);
			}
		}
	}

	EndPaint(hWnd, &ps);
}

LPARAM CALLBACK MainDlgProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
	switch (message)
	{
		MSG_CRACK_RET(WM_INITDIALOG, OnInitDialog);
		MSG_CRACK(WM_CLOSE, OnClose);
		MSG_CRACK(WM_COMMAND, OnCommand);
		MSG_CRACK(WM_DELETEITEM, OnDeleteItem);
		MSG_CRACK(WM_DRAWITEM, OnDrawItem);
		MSG_CRACK(WM_MEASUREITEM, OnMeasureItem);
		MSG_CRACK(WM_PAINT, OnPaint);
	}
	return 0;
}

int APIENTRY WinMain(HINSTANCE hInstance,
                     HINSTANCE hPrevInstance,
                     LPSTR     lpCmdLine,
                     int       nCmdShow)
{
	hInst = hInstance;
 	DialogBoxParam(hInstance, (LPCTSTR) IDD_MAIN, 0, (DLGPROC) MainDlgProc, (LPARAM) lpCmdLine);
	return 0;
}



