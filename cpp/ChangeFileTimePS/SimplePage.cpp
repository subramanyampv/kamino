// SimplePage.cpp: implementation of the SimplePage class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "SimplePage.h"

LPTSTR IncludeTrailingBackSlash(LPTSTR buf) {
	int len = lstrlen(buf);
	if (len > 0 && buf[len-1] != '\\')
	{
		buf[len] = '\\';
		buf[len+1] = '\0';
	}
	return buf;
}

BOOL CALLBACK RecurseModeDlgProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	static LPTSTR filter;
	switch (msg) {
		case WM_INITDIALOG:
			filter = (LPTSTR) lParam;
			CheckRadioButton(hWnd, IDC_APPLY_SIMPLE, IDC_APPLY_RECURSE, IDC_APPLY_SIMPLE);
			CheckDlgButton(hWnd, IDC_FILES, BST_CHECKED);
			CheckDlgButton(hWnd, IDC_FOLDERS, BST_CHECKED);
			return 1;
			break;

		case WM_CLOSE:
			EndDialog(hWnd, 0);
			break;
		case WM_COMMAND:
			switch (LOWORD(wParam)) {
				case IDOK:
					if (IsDlgButtonChecked(hWnd, IDC_APPLY_SIMPLE)==BST_CHECKED)
						EndDialog(hWnd, RECURSE_SIMPLE);
					else {
						int ret=0;
						if (IsDlgButtonChecked(hWnd, IDC_FILES)==BST_CHECKED)
							ret |= RECURSE_FILES;
						if (IsDlgButtonChecked(hWnd, IDC_FOLDERS)==BST_CHECKED)
							ret |= RECURSE_FOLDERS;
						if (IsDlgButtonChecked(hWnd, IDC_NOT_FOLDER)==BST_CHECKED)
							ret |= RECURSE_SKIP_ROOT;
						GetDlgItemText(hWnd, IDC_FILTER, filter, MAX_PATH);
						EndDialog(hWnd, ret);
					}
					break;
				case IDCANCEL:
					EndDialog(hWnd, 0);
					break;
				default:
					break;
			}
			break;
		default:
			break;
	}
	return 0;
}

int CSimplePage::RecurseMode()
{
	int ret=DialogBoxParam(_Module.GetModuleInstance(), MAKEINTRESOURCE(IDD_RECURSE), hWnd,
		(DLGPROC) RecurseModeDlgProc, (LPARAM) recurseFilter);
	if (lstrlen(recurseFilter)==0)
		lstrcpy(recurseFilter, _T("*.*"));

	return ret;
}

void CSimplePage::recurseThat(LPCTSTR szDir)
{
	HANDLE fh;
	WIN32_FIND_DATA fd;
	TCHAR buf[MAX_PATH];

	lstrcat( IncludeTrailingBackSlash(lstrcpy(buf, szDir)), _T("*.*") );
	//MessageBox(0, buf, "", 0);
	if ( (fh=FindFirstFile(buf, &fd)) != INVALID_HANDLE_VALUE )
	{
		do {
			if (lstrcmp(fd.cFileName, _T(".")) && lstrcmp(fd.cFileName, _T("..")))
			{
				lstrcat( IncludeTrailingBackSlash( lstrcpy(buf, szDir) ), fd.cFileName);

				if (fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY)
				{
					recurseThat(buf);
				}

			}
		} while (FindNextFile(fh, &fd));
		FindClose(fh);
	}

	lstrcat( IncludeTrailingBackSlash(lstrcpy(buf, szDir)), recurseFilter );
	
	if ( (fh=FindFirstFile(buf, &fd)) != INVALID_HANDLE_VALUE )
	{
		do {
			if (lstrcmp(fd.cFileName, _T(".")) && lstrcmp(fd.cFileName, _T("..")))
			{
				lstrcat( IncludeTrailingBackSlash( lstrcpy(buf, szDir) ), fd.cFileName);
				
				if ( fd.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY )
				{
					if ( recurseMode & RECURSE_FOLDERS ) 
						templist->push_back(buf);
				}
				else
				{
					if ( recurseMode & RECURSE_FILES )
						templist->push_back(buf);
				}
			}
		} while (FindNextFile(fh, &fd));
		FindClose(fh);
	}
}
