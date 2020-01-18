#include "MainWindow.h"
#include "About.h"
#include "Render.h"
#include "resource.h"

MainWindow::MainWindow(App &app) : AbstractDialog(app, (LPCTSTR)IDD_MAIN)
{
	myTree = treeFactory.Create(TreeTypeSearch, KeyTypeInteger);
}

MainWindow::~MainWindow()
{
	delete myTree;
}

void MainWindow::SizeControls()
{
	RECT rt;
	int i;
	GetClientRect(GetWnd(), &rt);
	MoveChildWindow(ID_INPUT, 0, rt.bottom - 40, rt.right - 300, 20);
	MoveChildWindow(ID_ADD, rt.right - 300, rt.bottom - 40, 100, 20);
	MoveChildWindow(ID_FREE, rt.right - 200, rt.bottom - 40, 100, 20);
	MoveChildWindow(ID_KEYTYPE, rt.right - 100, rt.bottom - 40, 100, 20);

	i = rt.right / 4;
	MoveChildWindow(ID_OPENFILE, 0, rt.bottom - 20, i, 20);
	MoveChildWindow(ID_SAVEMETAFILE, i, rt.bottom - 20, i, 20);
	MoveChildWindow(ID_ABOUT, 2 * i, rt.bottom - 20, i, 20);
	MoveChildWindow(ID_EXIT, 3 * i, rt.bottom - 20, rt.right - 3 * i, 20);
}

void MainWindow::OpenTreeFile(LPCTSTR szFile)
{
	FILE *fp;
	key data;
	int success;

	myTree->Clear();

	_tfopen_s(&fp, szFile, _T("r"));
	while (!feof(fp))
	{
		switch (myTree->GetKeyType())
		{
			case KeyTypeChar:
				success = _ftscanf_s(fp, _T("%c"), &data.c) != EOF;
				break;
			case KeyTypeInteger:
				success = _ftscanf_s(fp, _T("%d"), &data.i);
				break;
			case KeyTypeFloat:
				success = _ftscanf_s(fp, _T("%f"), &data.f) != EOF;
				break;
			case KeyTypeString:
				data.s  = (LPTSTR)malloc(sizeof(TCHAR) * MAX_PATH);
				success = _ftscanf_s(fp, _T("%s"), data.s) != EOF;
				break;
			default:
				// throw an error
				break;
		}

		if (success)
		{
			myTree->Add(data);
		}
	}

	fclose(fp);
	InvalidateRect(GetWnd(), NULL, TRUE);
}

void ReplaceFilter(LPTSTR filter)
{
	while (*filter)
	{
		if (*filter == '|')
			*filter = '\0';
		filter++;
	}
}

void MainWindow::OnOpenTreeFile()
{
	OPENFILENAME of;
	TCHAR filter[100];
	LPTSTR pfilter = (LPTSTR)&filter;

	LoadString(App::Instance(), IDS_OPEN_FILTER, pfilter, 100);
	ReplaceFilter(pfilter);

	memset(&of, 0, sizeof(of));
	of.lStructSize  = sizeof(of);
	of.hwndOwner    = GetWnd();
	of.Flags        = OFN_HIDEREADONLY | OFN_FILEMUSTEXIST | OFN_PATHMUSTEXIST;
	of.lpstrFile    = (LPTSTR)malloc(MAX_PATH);
	of.lpstrFile[0] = '\0';
	of.nMaxFile     = MAX_PATH;
	of.lpstrDefExt  = _T("emf");
	of.lpstrFilter  = pfilter;

	if (GetOpenFileName(&of))
	{
		OpenTreeFile(of.lpstrFile);
	}

	free(of.lpstrFile);
}

void MainWindow::OnSaveMetafile()
{
	OPENFILENAME of;
	TCHAR filter[100];
	LPTSTR pfilter = (LPTSTR)&filter;

	if (myTree->GetRoot() == NULL)
	{
		return;
	}

	LoadString(App::Instance(), IDS_SAVE_FILTER, pfilter, 100);
	ReplaceFilter(pfilter);

	memset(&of, 0, sizeof(of));
	of.lStructSize  = sizeof(of);
	of.hwndOwner    = GetWnd();
	of.Flags        = OFN_HIDEREADONLY | OFN_OVERWRITEPROMPT;
	of.lpstrFile    = (LPTSTR)malloc(MAX_PATH);
	of.lpstrFile[0] = '\0';
	of.nMaxFile     = MAX_PATH;
	of.lpstrDefExt  = _T("emf");
	of.lpstrFilter  = pfilter;

	if (GetSaveFileName(&of))
	{
		renderMetafile(myTree, GetWnd(), of.lpstrFile);
	}

	free(of.lpstrFile);
}

void MainWindow::OnAdd()
{
	BOOL success;
	key data;
	success = FALSE;
	int len;

	switch (myTree->GetKeyType())
	{
		case KeyTypeChar:
			TCHAR buf[2];
			if (success = (GetDlgItemText(GetWnd(), ID_INPUT, buf, 2) != 0))
				data.c = buf[0];
			break;

		case KeyTypeInteger:
			data.i = (int)GetDlgItemInt(GetWnd(), ID_INPUT, &success, TRUE);
			break;

		case KeyTypeFloat:
			LPTSTR s;
			len = GetWindowTextLength(GetDlgItem(GetWnd(), ID_INPUT)) + 1;
			if (len > 0)
			{
				s       = (LPTSTR)malloc(sizeof(TCHAR) * len);
				success = GetDlgItemText(GetWnd(), ID_INPUT, s, len) != 0;
				_stscanf_s(s, _T("%f"), &data.f);
				free(s);
			}

			break;

		case KeyTypeString:
			len = GetWindowTextLength(GetDlgItem(GetWnd(), ID_INPUT)) + 1;
			if (len > 0)
			{
				data.s  = (LPTSTR)malloc(sizeof(TCHAR) * len);
				success = GetDlgItemText(GetWnd(), ID_INPUT, data.s, len) != 0;
			}
			break;
	}

	if (success)
	{
		myTree->Add(data);
		InvalidateRect(GetWnd(), NULL, TRUE);
	}

	SendDlgItemMessage(
		GetWnd(), ID_INPUT, EM_SETSEL, 0, -1); // select everything
}

void MainWindow::KeyTypeChanged(KeyType keyType)
{
	int i, j;

	/* Refresh combo box */
	j = SendDlgItemMessage(GetWnd(), ID_KEYTYPE, CB_GETCOUNT, 0, 0);
	i = 0;
	while ((i < j) &&
		   (keyType != (char)SendDlgItemMessage(
						   GetWnd(), ID_KEYTYPE, CB_GETITEMDATA, i, 0)))
		i++;
	if (i < j)
		SendDlgItemMessage(GetWnd(), ID_KEYTYPE, CB_SETCURSEL, i, 0);

	/* Refresh Menu Items */
	/* Remember that the order is char, int, float, string */

	switch (keyType)
	{
		case KeyTypeChar:
			i = ID_TREE_CHAR;
			break;
		case KeyTypeInteger:
			i = ID_TREE_INT;
			break;
		case KeyTypeFloat:
			i = ID_TREE_FLOAT;
			break;
		case KeyTypeString:
			i = ID_TREE_STRING;
			break;
		default:
			i = 0;
	}
	CheckMenuRadioItem(GetSubMenu(GetMenu(GetWnd()), 1),
					   ID_TREE_CHAR,
					   ID_TREE_STRING,
					   i,
					   MF_BYCOMMAND);
}

void MainWindow::SetKeyType(KeyType keyType)
{
	AbstractTree *oldTree = myTree;
	myTree                = treeFactory.Create(oldTree->GetTreeType(), keyType);
	delete oldTree;
	KeyTypeChanged(keyType);
	InvalidateRect(GetWnd(), NULL, TRUE);
}

void MainWindow::TreeTypeChanged(TreeType treeType)
{
	int i;
	switch (treeType)
	{
		case TreeTypeSimple:
			i = ID_TREE_SIMPLE;
			break;
		case TreeTypeSearch:
			i = ID_TREE_SEARCH;
			break;
		case TreeTypeAVL:
			i = ID_TREE_AVL;
			break;
		default:
			i = 0;
	}

	CheckMenuRadioItem(GetSubMenu(GetMenu(GetWnd()), 1),
					   ID_TREE_SIMPLE,
					   ID_TREE_AVL,
					   i,
					   MF_BYCOMMAND);
}

void MainWindow::SetTreeType(TreeType treeType)
{
	AbstractTree *oldTree = myTree;
	myTree                = treeFactory.Create(treeType, oldTree->GetKeyType());
	delete oldTree;
	TreeTypeChanged(treeType);
	InvalidateRect(GetWnd(), NULL, TRUE);
}

// Adds a string to the combo box.
int CbAddString(HWND hWnd, int id, LPCTSTR string)
{
	return SendDlgItemMessage(hWnd, id, CB_ADDSTRING, 0, (LPARAM)string);
}

// Sets item data on a item in the combo box.
int CbSetItemData(HWND hWnd, int id, int index, LPARAM data)
{
	return SendDlgItemMessage(hWnd, id, CB_SETITEMDATA, index, data);
}

/**
 * Adds an entry to the key type drop down box.
 *
 * The entry is specified by the keyType, which needs to be one of the values
 * defined in Node.h, such as KeyTypeInteger.
 *
 * The text value comes from a string table. The IDs are mapped to the key type
 * by adding the offset 100
 * (e.g. KeyTypeInteger = 1 has the corresponding string ID = 101)
 */
void CbAddKeyType(HWND hWnd, int keyType)
{
	const int MAX_BUFFER    = 200;
	const int STRING_OFFSET = 100;
	TCHAR buffer[MAX_BUFFER];
	if (LoadString(
			App::Instance(), STRING_OFFSET + keyType, buffer, MAX_BUFFER) == 0)
	{
		// failed to load string
		_tcscpy_s(buffer, _T("Failed to load string"));
	}

	CbSetItemData(
		hWnd, ID_KEYTYPE, CbAddString(hWnd, ID_KEYTYPE, buffer), keyType);
}

LRESULT MainWindow::OnCommand(UINT message, WPARAM wParam, LPARAM lParam)
{
	int id    = LOWORD(wParam);
	int event = HIWORD(wParam);
	// Parse the menu selections:
	switch (id)
	{
		case ID_ABOUT:
			DialogBox(App::Instance(),
					  (LPCTSTR)IDD_ABOUTBOX,
					  GetWnd(),
					  (DLGPROC)About);
			break;
		case ID_EXIT:
			DestroyWindow(GetWnd());
			break;
		case ID_ADD:
			OnAdd();
			break;
		case ID_FREE:
			myTree->Clear();
			InvalidateRect(GetWnd(), NULL, TRUE);
			break;
		case ID_OPENFILE:
			OnOpenTreeFile();
			break;
		case ID_SAVEMETAFILE:
			OnSaveMetafile();
			break;
		case ID_TREE_CHAR:
			SetKeyType(KeyTypeChar);
			break;
		case ID_TREE_INT:
			SetKeyType(KeyTypeInteger);
			break;
		case ID_TREE_FLOAT:
			SetKeyType(KeyTypeFloat);
			break;
		case ID_TREE_STRING:
			SetKeyType(KeyTypeString);
			break;
		case ID_TREE_SIMPLE:
			SetTreeType(TreeTypeSimple);
			break;
		case ID_TREE_SEARCH:
			SetTreeType(TreeTypeSearch);
			break;
		case ID_TREE_AVL:
			SetTreeType(TreeTypeAVL);
			break;
		case ID_KEYTYPE:
			if (event == CBN_SELCHANGE)
			{
				int i;
				i = SendMessage((HWND)lParam, CB_GETCURSEL, 0, 0);
				if (i >= 0)
					SetKeyType((KeyType)SendMessage(
						(HWND)lParam, CB_GETITEMDATA, i, 0));
			}
		default:
			return DefWindowProc(GetWnd(), message, wParam, lParam);
	}

	return 0;
}

//
//  FUNCTION: WndProc(HWND, unsigned, WORD, LONG)
//
//  PURPOSE:  Processes messages for the main window.
//
//  WM_COMMAND	- process the application menu
//  WM_PAINT	- Paint the main window
//  WM_DESTROY	- post a quit message and return
//
//
LRESULT MainWindow::WndProc(UINT message, WPARAM wParam, LPARAM lParam)
{
	switch (message)
	{
		case WM_INITDIALOG:
			CbAddKeyType(GetWnd(), KeyTypeInteger);
			CbAddKeyType(GetWnd(), KeyTypeFloat);
			CbAddKeyType(GetWnd(), KeyTypeChar);
			CbAddKeyType(GetWnd(), KeyTypeString);

			KeyTypeChanged(myTree->GetKeyType());
			TreeTypeChanged(myTree->GetTreeType());
			return 1;
		case WM_SIZE:
			SizeControls();
			break;
		case WM_ERASEBKGND:
			return 1;
		case WM_COMMAND:
			return OnCommand(message, wParam, lParam);
		case WM_CLOSE:
			DestroyWindow(GetWnd());
			break;
		case WM_PAINT:
			PAINTSTRUCT ps;
			RECT rt;

			BeginPaint(GetWnd(), &ps);
			GetClientRect(GetWnd(), &rt);
			rt.bottom -= 39;
			rt.right++;
			render(myTree, &rt, ps.hdc);
			EndPaint(GetWnd(), &ps);
			break;
		case WM_DESTROY:
			PostQuitMessage(0);
			break;
		default:
			return 0;
	}
	return 0;
}
