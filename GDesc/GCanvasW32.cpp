// GCanvasW32.cpp: implementation of the GCanvasW32 class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "GCanvasW32.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

GCanvasW32::GCanvasW32(HANDLE handle)
{
	if (IsWindow((HWND) handle) || (!handle))
	{
		FWnd = (HWND) handle;
		FHandle = GetDC(FWnd);
	}
	else
	{
		FWnd = 0;
		FHandle = (HDC) handle;
	}
		
	oldPen = (HPEN) SelectObject(FHandle, CreatePen(PS_SOLID, 1, 0));
	oldBrush = (HBRUSH) SelectObject(FHandle, CreateSolidBrush(0x00FFFFFF));
}

GCanvasW32::~GCanvasW32()
{
	DeleteObject(SelectObject(FHandle, oldPen));
	DeleteObject(SelectObject(FHandle, oldBrush));
	if (FWnd)
		ReleaseDC(FWnd, FHandle);
}

long GCanvasW32::GetTextColor()
{
	return FTextColor;
}

long GCanvasW32::GetOutlineColor()
{
	return FOutlineColor;
}

long GCanvasW32::GetBgColor()
{
	return FBgColor;
}

void GCanvasW32::SetTextColor(long newColor)
{
	::SetTextColor(FHandle, FTextColor = newColor);
}

void GCanvasW32::SetOutlineColor(long newColor)
{
	if (newColor != FOutlineColor)
		DeleteObject(SelectObject(FHandle, CreatePen(PS_SOLID, 1, FOutlineColor = newColor)));
}

void GCanvasW32::SetBgColor(long newColor)
{
	if (newColor != FBgColor)
		DeleteObject(SelectObject(FHandle, CreateSolidBrush(FBgColor = newColor)));
}

void GCanvasW32::Rectangle(int x1, int y1, int x2, int y2)
{
	::Rectangle(FHandle, x1, y1, x2, y2);
}

void GCanvasW32::TextOut(LPCTSTR string, int length, int x, int y)
{
	::TextOut(FHandle, x, y, string, (length == -1) ? _tcslen(string) : length);
}

BOOL GCanvasW32::IsTextTransparent()
{
	return (::GetBkMode(FHandle) == TRANSPARENT);
}

void GCanvasW32::SetTextTransparent(BOOL fTransparent)
{
	::SetBkMode(FHandle, (fTransparent) ? TRANSPARENT : OPAQUE);
}

void GCanvasW32::GetTextExtent(LPCTSTR szBuf, int length, int *cx, int *cy)
{
	SIZE sz;
	::GetTextExtentPoint32(FHandle, szBuf, (length == -1) ? _tcslen(szBuf) : length, &sz);
	*cx = sz.cx;
	*cy = sz.cy;
}

void GCanvasW32::SetClippingRect(LPRECT lpRect)
{
	HRGN rgn1;
	rgn1 = ::CreateRectRgnIndirect(lpRect);
	::SelectClipRgn(FHandle, rgn1);
	DeleteObject(rgn1);
}
