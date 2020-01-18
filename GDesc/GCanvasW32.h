// GCanvasW32.h: interface for the GCanvasW32 class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_GCANVASW32_H__55EAE44E_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
#define AFX_GCANVASW32_H__55EAE44E_9C6A_11D3_B5B1_D2158548A178__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "GAbstractCanvas.h"

class GCanvasW32 : public GAbstractCanvas  
{
public:
	virtual void SetClippingRect(LPRECT lpRect);
	virtual void GetTextExtent(LPCTSTR szBuf, int length, int *cx, int *cy);
	virtual void SetTextTransparent(BOOL fTransparent);
	virtual BOOL IsTextTransparent();
	virtual void TextOut(LPCTSTR string, int length, int x, int y);
	virtual long GetBgColor();
	virtual long GetOutlineColor();
	virtual long GetTextColor();
	virtual void SetBgColor(long newColor);
	virtual void SetOutlineColor(long newColor);
	virtual void SetTextColor(long newColor);
	virtual void Rectangle(int x1, int y1, int x2, int y2);
	GCanvasW32(HANDLE handle);
	virtual ~GCanvasW32();

private:
	HWND FWnd;
	HBRUSH oldBrush;
	HPEN oldPen;
	long FBgColor;
	long FOutlineColor;
	long FTextColor;
	HDC FHandle;
};

#endif // !defined(AFX_GCANVASW32_H__55EAE44E_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
