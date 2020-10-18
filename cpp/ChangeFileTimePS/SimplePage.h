// SimplePage.h: interface for the SimplePage class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_SIMPLEPAGE_H__DDC5DD14_F203_440C_8BF0_3B6998093395__INCLUDED_)
#define AFX_SIMPLEPAGE_H__DDC5DD14_F203_440C_8BF0_3B6998093395__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "PropertyPageDialog.h"
#include "resource.h"

#define RECURSE_SIMPLE 1
#define RECURSE_FILES 2
#define RECURSE_FOLDERS 4
#define RECURSE_SKIP_ROOT 8


//#define MULTIPLE_FILES list.getFileCount() > 1

#define GETDATEPICKER(n) GetDlgItem(hWnd, IDC_DATEPICKER1 + n)
#define GETTIMEPICKER(n) GetDlgItem(hWnd, IDC_TIMEPICKER1 + n)
#define GET_SOME_FILETIME(n, ft) GetSomeFileTime(GETDATEPICKER(n), GETTIMEPICKER(n), ft)

#define BUTTON_HANDLER(id, proc) if (LOWORD(wParam) == id && HIWORD(wParam)==BN_CLICKED) { proc(); return 0; }
#define BUTTON_HANDLER_RANGE(id_min, id_max, proc) if (LOWORD(wParam) >= id_min && LOWORD(wParam) <= id_max && HIWORD(wParam)==BN_CLICKED) { proc(LOWORD(wParam)); return 0; }

class CSimplePage : public CPropertyPageDialog {
private:
	void recurseThat(LPCTSTR szDir);
	int RecurseMode();
	string_list mylist;
	string_list *templist;
	bool hasfolders;
	int recurseMode;
	TCHAR recurseFilter[MAX_PATH];
	UINT bInitArchive, bInitReadOnly, bInitHidden, bInitSystem;
public:
	CSimplePage(string_list& otherList, bool hasfolders) : CPropertyPageDialog() {
		int it;
        
		templist = NULL;

		for ( it = 0; it < otherList.getSize(); it++)
		{
        // 'it' points at the next filename.  Allocate a new copy of the string
        // that the page will own.
			mylist.push_back( otherList.getAt(it) );
		}

		this->hasfolders = hasfolders;
		//MessageBox(0, "SimplePage", "", 0);
	}

	void initTempList() {
		if (templist != NULL)
			delete templist;
		int it;
        
		templist = new string_list();

		for ( it = 0; it < mylist.getSize(); it++)
		{
			templist->push_back( mylist.getAt(it) );
		}

	}

	virtual ~CSimplePage()
	{
		if (templist != NULL)
			delete templist;
	}


	void OnAttributesClick() {
		bool f = IsDlgButtonChecked(hWnd, IDC_ATTRIBUTES)==BST_CHECKED;
		EnableWindow(GetDlgItem(hWnd, IDC_ARCHIVE), f);
		EnableWindow(GetDlgItem(hWnd, IDC_READONLY), f);
		EnableWindow(GetDlgItem(hWnd, IDC_HIDDEN), f);
		EnableWindow(GetDlgItem(hWnd, IDC_SYSTEM), f);
	}

	void OnTimesClick() {
		bool f = IsDlgButtonChecked(hWnd, IDC_TIMES)==BST_CHECKED;
		EnableWindow(GetDlgItem(hWnd, IDC_ONE_TIME), f);
		EnableWindow(GetDlgItem(hWnd, IDC_CREATE), f);
		EnableWindow(GetDlgItem(hWnd, IDC_LAST_ACCESS), f);
		EnableWindow(GetDlgItem(hWnd, IDC_LAST_WRITE), f);
		EnableWindow(GetDlgItem(hWnd, IDC_DATEPICKER1), f);
		EnableWindow(GetDlgItem(hWnd, IDC_DATEPICKER2), f);
		EnableWindow(GetDlgItem(hWnd, IDC_DATEPICKER3), f);
		EnableWindow(GetDlgItem(hWnd, IDC_TIMEPICKER1), f);
		EnableWindow(GetDlgItem(hWnd, IDC_TIMEPICKER2), f);
		EnableWindow(GetDlgItem(hWnd, IDC_TIMEPICKER3), f);
		EnableWindow(GetDlgItem(hWnd, IDC_NOW1), f);
		EnableWindow(GetDlgItem(hWnd, IDC_NOW2), f);
		EnableWindow(GetDlgItem(hWnd, IDC_NOW3), f);
		EnableWindow(GetDlgItem(hWnd, IDC_READONLY_TOO), f);

	}

	void OnOneTimeClick() {
		int flag = (IsDlgButtonChecked(hWnd, IDC_ONE_TIME)==BST_CHECKED) ? SW_HIDE : SW_SHOW;
		ShowWindow(GetDlgItem(hWnd, IDC_DATEPICKER2), flag);
		ShowWindow(GetDlgItem(hWnd, IDC_DATEPICKER3), flag);
		ShowWindow(GetDlgItem(hWnd, IDC_TIMEPICKER2), flag);
		ShowWindow(GetDlgItem(hWnd, IDC_TIMEPICKER3), flag);
		ShowWindow(GetDlgItem(hWnd, IDC_NOW2), flag);
		ShowWindow(GetDlgItem(hWnd, IDC_NOW3), flag);
	}



	void applyAttribute(LPDWORD attrs, UINT checkboxState, DWORD fileAttribute)
	{
		if (checkboxState==BST_CHECKED)
			*attrs |= fileAttribute;
		else if (checkboxState==BST_UNCHECKED)
			*attrs &= ~fileAttribute;
	}

	void prepareAttribute(LPDWORD orMask, LPDWORD andMask, UINT bFlag, UINT bInitFlag, DWORD fileAttribute)
	{
		if (bFlag != bInitFlag)
		{
			if (bFlag == BST_CHECKED)
				*orMask |= fileAttribute;
			else if (bFlag == BST_UNCHECKED)
				*andMask &= ~fileAttribute;
		}
	}

	void prepareMasks(LPDWORD orMask, LPDWORD andMask, UINT bArchive, UINT bReadOnly, UINT bHidden, UINT bSystem)
	{
		*andMask = 0xFFFFFFFF;
		*orMask = 0;
		prepareAttribute(orMask, andMask, bArchive, bInitArchive, FILE_ATTRIBUTE_ARCHIVE);
		prepareAttribute(orMask, andMask, bReadOnly, bInitReadOnly, FILE_ATTRIBUTE_READONLY);
		prepareAttribute(orMask, andMask, bHidden, bInitHidden, FILE_ATTRIBUTE_HIDDEN);
		prepareAttribute(orMask, andMask, bSystem, bInitSystem, FILE_ATTRIBUTE_SYSTEM);
	}


	void MySetFileAttrs(LPCTSTR lpFileName, DWORD orMask, DWORD andMask)
	{
		DWORD attrs = GetFileAttributes(lpFileName);
		if (attrs == 0xFFFFFFFF)
		{
			// add a failure message to the log
		}
		else
		{
			attrs |= orMask;
			attrs &= andMask;

			if (!SetFileAttributes(lpFileName, attrs))
			{
				// add a failure message to the log
			}
		}

	}

	BOOL GetSomeFileTime(HWND hWndDateCtl, HWND hWndTimeCtl, LPFILETIME ft) {
		SYSTEMTIME p1;
		SYSTEMTIME p2;
		FILETIME f1;
		if (DateTime_GetSystemtime(hWndDateCtl, &p1)==GDT_VALID && DateTime_GetSystemtime(hWndTimeCtl, &p2)==GDT_VALID)
		{
			p1.wHour = p2.wHour;
			p1.wMilliseconds = p2.wMilliseconds;
			p1.wMinute = p2.wMinute;
			p1.wSecond = p2.wSecond;
			if (!SystemTimeToFileTime(&p1, &f1)) return FALSE;
			return LocalFileTimeToFileTime(&f1, ft);
		}
		else
		{
			return FALSE;
		}
	}




	void MySetFileTime(LPCTSTR lpFileName, LPFILETIME f1, LPFILETIME f2, LPFILETIME f3)
	{
		HANDLE hFile = CreateFile(lpFileName, GENERIC_WRITE, FILE_SHARE_READ, NULL, OPEN_EXISTING,
			FILE_FLAG_BACKUP_SEMANTICS, NULL);
		if (hFile == INVALID_HANDLE_VALUE)
		{
			// add something to the log
		}
		else
		{
			if (!SetFileTime(hFile, f1, f2, f3))
			{
				// add something to the log
			}
			CloseHandle(hFile);
		}
	}


	void MyGetFileTime(LPCTSTR lpFileName, SYSTEMTIME (s)[3])
	{
		HANDLE hFile = CreateFile(lpFileName, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING,
			FILE_FLAG_BACKUP_SEMANTICS, NULL);
		if (hFile == INVALID_HANDLE_VALUE)
		{
			// add something to the log
		}
		else
		{
			FILETIME f[3], lf[3];
			if (!GetFileTime(hFile, &f[0], &f[1], &f[2]))
			{
				// add something to the log
			}
			for (int i = 0; i < 3; i++)
			{
				FileTimeToLocalFileTime(&f[i], &lf[i]);
				FileTimeToSystemTime(&lf[i], &s[i]);
			}
			CloseHandle(hFile);
		}
	}

	void InitDateTimeCtls(LPCTSTR lpFileName)
	{
		SYSTEMTIME s[3];
		MyGetFileTime(lpFileName, s);
		for (int i = 0; i < 3; i++)
		{
			DateTime_SetSystemtime(GETDATEPICKER(i), GDT_VALID, &s[i]);
			DateTime_SetSystemtime(GETTIMEPICKER(i), GDT_VALID, &s[i]);
		}
	}

	void OnNowClick(UINT id) {
		SYSTEMTIME s;
		GetLocalTime(&s);
		DateTime_SetSystemtime(GETDATEPICKER(id - IDC_NOW1), GDT_VALID, &s);
		DateTime_SetSystemtime(GETTIMEPICKER(id - IDC_NOW1), GDT_VALID, &s);
		Changed();
	}

	bool OnOK() {

		LPCTSTR lpFileName=NULL;
		int it;

		if (IsDlgButtonChecked(hWnd, IDC_ATTRIBUTES)!=BST_CHECKED && IsDlgButtonChecked(hWnd, IDC_TIMES)!=BST_CHECKED)
			return true;

		if (hasfolders)
		{
			recurseMode = RecurseMode();
			if (!recurseMode)
				return false;
		}

		SetCursor(LoadCursor(0, IDC_WAIT));

		if (recurseMode & RECURSE_SKIP_ROOT)
		{
			templist = new string_list();
			for ( it = 0; it < mylist.getSize(); it++)
			{
				if (!(GetFileAttributes(mylist[it]) & FILE_ATTRIBUTE_DIRECTORY))
					templist->push_back(mylist[it]);
			}
		}
		else
			initTempList();

		if (recurseMode != RECURSE_SIMPLE)
		{
			for ( it = 0; it < mylist.getSize(); it++)
			{
				if (GetFileAttributes(mylist[it]) & FILE_ATTRIBUTE_DIRECTORY)
					recurseThat(mylist[it]);
			}
		}

		if (IsDlgButtonChecked(hWnd, IDC_ATTRIBUTES)==BST_CHECKED)
		{
			// set file attributes

			UINT bArchive = IsDlgButtonChecked(hWnd, IDC_ARCHIVE);
			UINT bReadOnly = IsDlgButtonChecked(hWnd, IDC_READONLY);
			UINT bHidden = IsDlgButtonChecked(hWnd, IDC_HIDDEN);
			UINT bSystem = IsDlgButtonChecked(hWnd, IDC_SYSTEM);

			DWORD orMask, andMask;
			prepareMasks(&orMask, &andMask, bArchive, bReadOnly, bHidden, bSystem);


			// for each file:
			for ( it = 0; it < templist->getSize(); it++)
			{
				//MessageBox(0, it->c_str(), "", 0);

				MySetFileAttrs(templist->getAt(it), orMask, andMask);
			}

			bInitArchive = IsDlgButtonChecked(hWnd, IDC_ARCHIVE);
			bInitReadOnly = IsDlgButtonChecked(hWnd, IDC_READONLY);
			bInitHidden = IsDlgButtonChecked(hWnd, IDC_HIDDEN);
			bInitSystem = IsDlgButtonChecked(hWnd, IDC_SYSTEM);

		}

		if (IsDlgButtonChecked(hWnd, IDC_TIMES)==BST_CHECKED)
		{
			bool failure = false;
			FILETIME ftCreate, ftLastAccess, ftLastWrite;
			LPFILETIME lpftCreate=NULL, lpftLastAccess=NULL, lpftLastWrite=NULL;

			if (IsDlgButtonChecked(hWnd, IDC_ONE_TIME) == BST_CHECKED)
			{
				if ( ! GET_SOME_FILETIME(0, &ftCreate) )
				{
					// generic failure
					failure = true;
					
				}
				else
				{
					lpftCreate = lpftLastAccess = lpftLastWrite = &ftCreate;
				}

			}
			else
			{
				if (IsDlgButtonChecked(hWnd, IDC_CREATE)==BST_CHECKED)
				{
					if ( !GET_SOME_FILETIME(0, &ftCreate) )
					{
						failure = true;
					}
					else
					{
						lpftCreate = &ftCreate;
					}
				}

				if (!failure && IsDlgButtonChecked(hWnd, IDC_LAST_ACCESS)==BST_CHECKED)
				{
					if ( !GET_SOME_FILETIME(1, &ftLastAccess) )
					{
						failure=true;
					}
					else
					{
						lpftLastAccess = &ftLastAccess;
					}
				}

				if (!failure && IsDlgButtonChecked(hWnd, IDC_LAST_WRITE)==BST_CHECKED)
				{
					if ( !GET_SOME_FILETIME(2, &ftLastWrite) )
					{
						failure=true;
					}
					else
					{
						lpftLastWrite = &ftLastWrite;
					}
				}
			}

			if (!failure)
			{
				bool includeReadOnly = IsDlgButtonChecked(hWnd, IDC_READONLY_TOO)==BST_CHECKED;
				for ( it = 0; it < templist->getSize(); it++ )
				{
					bool restoreReadOnly = false;
					DWORD attrs;

					if (includeReadOnly)
					{
						attrs = GetFileAttributes(templist->getAt(it));
						if (restoreReadOnly = (attrs & FILE_ATTRIBUTE_READONLY))
						{
							SetFileAttributes(templist->getAt(it), attrs & ~FILE_ATTRIBUTE_READONLY);
							//MessageBox(0, it->c_str(), "", 0);
						}
					}

					MySetFileTime(templist->getAt(it), lpftCreate, lpftLastAccess, lpftLastWrite);

					if (restoreReadOnly)
						SetFileAttributes(templist->getAt(it), attrs);

				}
			}

		}

		delete templist;
		templist = NULL;
		SetCursor(LoadCursor(0, IDC_ARROW));

		return true;
	}

	void Changed()
	{
		SendMessage ( GetParent(hWnd), PSM_CHANGED, (WPARAM) hWnd, 0 );
	}

	void Nag() {
		DWORD test = GetTickCount();
		do {
		MessageBox(hWnd, _T("ChangeFileTimePS is shareware. Visit http://nikosgeorgiou.tripod.com to find out how to become a registered user and get rid of this message."), _T("Shareware reminder"), MB_ICONINFORMATION);
		test = GetTickCount() - test;
		} while (test < 2000);
		
	}


	void checkFileAttribute(DWORD attrs, DWORD attrBit, UINT* value, bool firstTime)
	{
		UINT test;

		test = (attrs & attrBit) ? BST_CHECKED : BST_UNCHECKED;
		if (firstTime)
			*value = test;
		else if (*value != test)
			*value = BST_INDETERMINATE;
	}

	void initCheckBox(UINT ctlID, UINT value)
	{
		if (value == BST_INDETERMINATE)
			SendDlgItemMessage(hWnd, ctlID, BM_SETSTYLE, BS_AUTO3STATE, 0);

		CheckDlgButton(hWnd, ctlID, value);
	}


	LRESULT Handler(UINT msg, WPARAM wParam, LPARAM lParam)
	{
		int it;

		switch (msg)
		{
			case WM_INITDIALOG:
				UINT bArchive, bReadOnly, bHidden, bSystem;

				for ( it = 0; it < mylist.getSize(); it++)
				{

					SendDlgItemMessage(hWnd, IDC_LIST1, LB_ADDSTRING, 0, (LPARAM) mylist[it]);
					DWORD attrs = GetFileAttributes(mylist[it]);
					
					checkFileAttribute(attrs, FILE_ATTRIBUTE_ARCHIVE, &bArchive, it==0);
					checkFileAttribute(attrs, FILE_ATTRIBUTE_READONLY, &bReadOnly, it==0);
					checkFileAttribute(attrs, FILE_ATTRIBUTE_HIDDEN, &bHidden, it==0);
					checkFileAttribute(attrs, FILE_ATTRIBUTE_SYSTEM, &bSystem, it==0);
				}

				initCheckBox(IDC_ARCHIVE, bInitArchive = bArchive);
				initCheckBox(IDC_READONLY, bInitReadOnly = bReadOnly);
				initCheckBox(IDC_HIDDEN, bInitHidden = bHidden);
				initCheckBox(IDC_SYSTEM, bInitSystem = bSystem);

				initCheckBox(IDC_ATTRIBUTES, BST_CHECKED);
				initCheckBox(IDC_TIMES, BST_CHECKED);
				initCheckBox(IDC_CREATE, BST_CHECKED);
				initCheckBox(IDC_LAST_ACCESS, BST_CHECKED);
				initCheckBox(IDC_LAST_WRITE, BST_CHECKED);
				initCheckBox(IDC_ONE_TIME, BST_CHECKED);
				OnOneTimeClick();

				InitDateTimeCtls(mylist[0]);


				break;
			case WM_COMMAND:
				BUTTON_HANDLER(IDC_ATTRIBUTES, OnAttributesClick);
				BUTTON_HANDLER(IDC_TIMES, OnTimesClick);
				BUTTON_HANDLER(IDC_ONE_TIME, OnOneTimeClick);
				BUTTON_HANDLER(IDC_ARCHIVE, Changed);
				BUTTON_HANDLER(IDC_READONLY, Changed);
				BUTTON_HANDLER(IDC_HIDDEN, Changed);
				BUTTON_HANDLER(IDC_SYSTEM, Changed);
				BUTTON_HANDLER_RANGE(IDC_NOW1, IDC_NOW3, OnNowClick);
				break;
			case WM_NOTIFY:
				{
				NMHDR* phdr = (NMHDR*) lParam;

				switch ( phdr->code )
					{
					case PSN_APPLY:
						bool result;
						result = OnOK();
						if (result)
							Nag();
						SetWindowLongPtr( hWnd, DWLP_MSGRESULT, (result) ? PSNRET_NOERROR : PSNRET_INVALID);
						return 1;
					break;

					case DTN_DATETIMECHANGE:
						// If the user changes any of the DTP controls, enable
						// the Apply button.

						Changed();
					break;
					}
				}

		}
		return 0;
	}
};


#endif // !defined(AFX_SIMPLEPAGE_H__DDC5DD14_F203_440C_8BF0_3B6998093395__INCLUDED_)
