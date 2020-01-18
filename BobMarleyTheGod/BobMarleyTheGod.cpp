// BobMarleyTheGod.cpp : Defines the entry point for the application.
//
#include "stdafx.h"
#include "resource.h"

#define HIMETRIC_INCH 2540
#define PHOTO_COUNT 14

#define SPEED_MIN 0
#define SPEED_MAX 10
#define SMOOTH_MIN 1
#define SMOOTH_MAX 20

// Global Variables:
UINT uTimer = 0;
LPPICTURE bobPic = NULL;
HBRUSH blackBrush = (HBRUSH) GetStockObject(BLACK_BRUSH);
UINT currPic = 0;
bool keepUp = true;

// Foward declarations of functions included in this code module:
LRESULT CALLBACK    ScreenSaverProc(HWND, UINT, WPARAM, LPARAM);
LRESULT CALLBACK	About(HWND, UINT, WPARAM, LPARAM);
void LoadPictureFile(LPCTSTR szFile, LPPICTURE *lpPic);
void LoadMarleyPic();
void ReadData(int *iSpeed, int *iSmoothness);
void WriteData(int iSpeed, int iSmoothness);

void LoadMarleyPic()
{
	TCHAR szFile[MAX_PATH];
	TCHAR szFileX[MAX_PATH];
	int i;
	UINT oldPic = currPic;

	while (oldPic == currPic)
		currPic = 1 + (rand() % PHOTO_COUNT);

	// returns something like C:\Users\ngeor\Projects\github\BobMarleyTheGod\Debug\BobMarleyTheGod.scr
	GetModuleFileName(0, szFileX, MAX_PATH);
	LPTSTR lastOccurenceOfPath = _tcsrchr(szFileX, '\\');
	*lastOccurenceOfPath = '\0';
	_tcscat_s(szFileX, MAX_PATH, _T("\\%d.jpg"));
	_stprintf_s(szFile, MAX_PATH, szFileX, currPic);
	LoadPictureFile(szFile, &bobPic);
}

void SetAndFillRectEx(HDC hdc, int x1, int y1, int x2, int y2)
{
	RECT rt;
	if (x1 < x2)
	{
		rt.left = x1;
		rt.right = x2;
	}
	else
	{
		rt.left = x2;
		rt.right = x1;
	}
	if (y1 < y2)
	{
		rt.top = y1;
		rt.bottom = y2;
	}
	else
	{
		rt.top = y2;
		rt.bottom = y1;
	}
	FillRect(hdc, &rt, blackBrush);
}

DWORD WINAPI MyThreadProc(LPVOID param)
{
	int x, y, newx, newy,
		cx = GetSystemMetrics(SM_CXSCREEN),
		cy = GetSystemMetrics(SM_CYSCREEN),
		step, sleepCount;
	double tanf, b;

	HWND hWnd = (HWND) param;
	long hmWidth, hmHeight;
	int nWidth, nHeight;
	RECT rc;
	bool fNewPicture = true;
	int fora;

	ReadData(&sleepCount, &step);
	sleepCount = SPEED_MAX - sleepCount;
	step = SMOOTH_MAX - step + 1;

	while (keepUp)
	{
		HDC hdc = GetDC(hWnd);
		if (fNewPicture)
		{
			if (bobPic) bobPic->Release();
			bobPic = NULL;
			LoadMarleyPic();

			bobPic->get_Width(&hmWidth);
			bobPic->get_Height(&hmHeight);

			// convert himetric to pixels
			nWidth = MulDiv(hmWidth, GetDeviceCaps(hdc, LOGPIXELSX), HIMETRIC_INCH);
			nHeight = MulDiv(hmHeight, GetDeviceCaps(hdc, LOGPIXELSY), HIMETRIC_INCH);

			// choose an angle from 0 to 89 degrees ...
			tanf = tan(3.14 * (rand() % 90) / 180);
			// ... or it's negative!
			if (rand() % 2) tanf = -tanf;

			// do we want to step backwards along the x'x ?
			fora = (rand() % 2) ? 1: -1;

			x = ((fora == -1) ? (cx) : (-nWidth)) - fora*step;
			b = rand() % (cy - nHeight);
			if (tanf != 0) b /= (tanf*x);
			y = (int) (tanf*x + b);
			fNewPicture = false;
		}


		if (bobPic)
		{
			newx = x + fora * step;
			newy = (int) (tanf * newx + b);
			if (fora > 0)
			{
				SetAndFillRectEx(hdc, x, y, newx, y + nHeight);
				if (tanf < 0)
					SetAndFillRectEx(hdc, newx, newy + nHeight, x + nWidth, y + nHeight);
				else if (tanf > 0)
					SetAndFillRectEx(hdc, newx, y, x + nWidth, newy);
			}
			else
			{
				SetAndFillRectEx(hdc, newx + nWidth, y, x + nWidth, y + nHeight);
				if (tanf < 0)
					SetAndFillRectEx(hdc, x, y, newx + nWidth, newy);
				else if (tanf > 0)
					SetAndFillRectEx(hdc, x, newy + nHeight, newx + nWidth, y + nHeight);
			}

			GetClientRect(hWnd, &rc);
			bobPic->Render(hdc, x = newx, (y = newy), nWidth, nHeight, 0, hmHeight, hmWidth, -hmHeight, &rc);

			if (((fora < 0) && (x + nWidth < 0)) || ((fora > 0) && (x > cx)) || ((y + nHeight < 0) && (fora*tanf < 0)))
				fNewPicture = true;
		}
		else
			fNewPicture = true;
		if (sleepCount > 0) Sleep(sleepCount);
		ReleaseDC(hWnd, hdc);
	}
	return 0;
}

//
//  FUNCTION: ScreenSaverProc(HWND, unsigned, WORD, LONG)
//
//  PURPOSE:  Processes messages for the main window.
//
//  WM_COMMAND	- process the application menu
//  WM_PAINT	- Paint the main window
//  WM_DESTROY	- post a quit message and return
//
//
LRESULT CALLBACK ScreenSaverProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
	DWORD thId;
	static HANDLE thH;

	switch (message)
	{
		case WM_CREATE:
			srand(time(NULL));
			thH = CreateThread(NULL, 0, MyThreadProc, hWnd, 0, &thId);
			break;
		case WM_DESTROY:
			keepUp = false;
			CloseHandle(thH);
			if (bobPic) bobPic->Release();
			break;
	}
	return DefScreenSaverProc(hWnd, message, wParam, lParam);
}

// Mesage handler for about box.
LRESULT CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
	switch (message)
	{
		case WM_INITDIALOG:
				return TRUE;

		case WM_COMMAND:
			if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
			{
				EndDialog(hDlg, LOWORD(wParam));
				return TRUE;
			}
			break;
	}
    return FALSE;
}

BOOL WINAPI ScreenSaverConfigureDialog(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
	int iSpeed, iSmoothness;
    switch(message)
    {
        case WM_INITDIALOG:
			ReadData(&iSpeed, &iSmoothness);
			SendDlgItemMessage(hDlg, IDC_SPEED, TBM_SETRANGE, 0, MAKELONG(SPEED_MIN, SPEED_MAX));
			SendDlgItemMessage(hDlg, IDC_SPEED, TBM_SETPOS, TRUE, iSpeed);
			SendDlgItemMessage(hDlg, IDC_SMOOTH, TBM_SETRANGE, 0, MAKELONG(SMOOTH_MIN, SMOOTH_MAX));
			SendDlgItemMessage(hDlg, IDC_SMOOTH, TBM_SETPOS, TRUE, SMOOTH_MAX - iSmoothness + 1);
            return TRUE;

        case WM_COMMAND:
            switch(LOWORD(wParam))
            {
                case IDOK:
					iSpeed = SendDlgItemMessage(hDlg, IDC_SPEED, TBM_GETPOS, 0, 0);
					iSmoothness = SMOOTH_MAX - SendDlgItemMessage(hDlg, IDC_SMOOTH, TBM_GETPOS, 0, 0) + 1;
					WriteData(iSpeed, iSmoothness);
                case IDCANCEL:
                    EndDialog(hDlg, LOWORD(wParam) == IDOK);
                return TRUE;
            }
    }
    return FALSE;
}

BOOL WINAPI RegisterDialogClasses(HANDLE hInst)
{
	InitCommonControls();
	return TRUE;
}

// This function loads a picture.
void LoadPictureFile(LPCTSTR szFile, LPPICTURE *lpPic)
{
	// open file
	HANDLE hFile = CreateFile(szFile, GENERIC_READ, 0, NULL, OPEN_EXISTING, 0, NULL);
//	ASSERT(INVALID_HANDLE_VALUE != hFile);

	// get file size
	DWORD dwFileSize = GetFileSize(hFile, NULL);
//	ASSERT(-1 != dwFileSize);

	LPVOID pvData = NULL;
	// alloc memory based on file size
	HGLOBAL hGlobal = GlobalAlloc(GMEM_MOVEABLE, dwFileSize);
//	ASSERT(NULL != hGlobal);

	pvData = GlobalLock(hGlobal);
//	ASSERT(NULL != pvData);

	DWORD dwBytesRead = 0;
	// read file and store in global memory
	BOOL bRead = ReadFile(hFile, pvData, dwFileSize, &dwBytesRead, NULL);
//	ASSERT(FALSE != bRead);
	GlobalUnlock(hGlobal);
	CloseHandle(hFile);

	LPSTREAM pstm = NULL;
	// create IStream* from global memory
	HRESULT hr = CreateStreamOnHGlobal(hGlobal, TRUE, &pstm);
//	ASSERT(SUCCEEDED(hr) && pstm);

	// Create IPicture from image file
	if (*lpPic)
		(*lpPic)->Release();
	hr = OleLoadPicture(pstm, dwFileSize, FALSE, IID_IPicture, (LPVOID *)lpPic);
//	ASSERT(SUCCEEDED(hr) && lpPic);
	pstm->Release();
}

void ReadData(int *iSpeed, int *iSmoothness)
{
	HKEY key1;
	DWORD disp;
	RegCreateKeyEx(HKEY_CURRENT_USER, _T("Software\\NGEOR\\BobMarleySaver"), 0,
		NULL, REG_OPTION_NON_VOLATILE, KEY_ALL_ACCESS, NULL, &key1, &disp);
	disp = sizeof(int);
	RegQueryValueEx(key1, _T("Speed"), NULL, NULL, (LPBYTE) iSpeed, &disp);
	if (*iSpeed < SPEED_MIN || *iSpeed > SPEED_MAX) *iSpeed = 4;
	disp = sizeof(int);
	RegQueryValueEx(key1, _T("Smoothness"), NULL, NULL, (LPBYTE) iSmoothness, &disp);
	if (*iSmoothness < SMOOTH_MIN || *iSmoothness > SMOOTH_MAX) *iSmoothness = SMOOTH_MIN;
	RegCloseKey(key1);
}

void WriteData(int iSpeed, int iSmoothness)
{
	HKEY key1;
	DWORD disp;

	RegCreateKeyEx(HKEY_CURRENT_USER, _T("Software\\NGEOR\\BobMarleySaver"), 0,
		NULL, REG_OPTION_NON_VOLATILE, KEY_ALL_ACCESS, NULL, &key1, &disp);
	RegSetValueEx(key1, _T("Speed"), 0, REG_DWORD, (LPBYTE) &iSpeed, sizeof(iSpeed));
	RegSetValueEx(key1, _T("Smoothness"), 0, REG_DWORD, (LPBYTE) &iSmoothness, sizeof(iSmoothness));
	RegCloseKey(key1);
}
