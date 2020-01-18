// GAbstractCanvas.h: interface for the GAbstractCanvas class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_GABSTRACTCANVAS_H__55EAE44D_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
#define AFX_GABSTRACTCANVAS_H__55EAE44D_9C6A_11D3_B5B1_D2158548A178__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

class GAbstractCanvas  
{
public:
	virtual void SetClippingRect(LPRECT lpRect) = 0;
	virtual void TextOut(LPCTSTR string, int length, int x, int y) = 0;
	virtual long GetBgColor() = 0;
	virtual long GetOutlineColor() = 0;
	virtual long GetTextColor() = 0;
	virtual void SetBgColor(long newColor) = 0;
	virtual void SetOutlineColor(long newColor) = 0;
	virtual void SetTextColor(long newColor) = 0;

	virtual void Rectangle(int x1, int y1, int x2, int y2) = 0;

	virtual void SetTextTransparent(BOOL fTransparent) = 0;
	virtual BOOL IsTextTransparent() = 0;
	virtual void GetTextExtent(LPCTSTR szBuf, int length, int *cx, int *cy) = 0;
	GAbstractCanvas();
	virtual ~GAbstractCanvas();

};

#endif // !defined(AFX_GABSTRACTCANVAS_H__55EAE44D_9C6A_11D3_B5B1_D2158548A178__INCLUDED_)
