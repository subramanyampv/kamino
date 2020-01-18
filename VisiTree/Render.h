// Render.h: interface for the Render module.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_RENDER_H__32BE33D3_65D6_4A03_9822_E14AF8B2A201__INCLUDED_)
#define AFX_RENDER_H__32BE33D3_65D6_4A03_9822_E14AF8B2A201__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include "AbstractTree.h"

void render(AbstractTree *mytree, LPRECT rt, HDC hdc);

void renderMetafile(AbstractTree *mytree, HWND hWnd, LPCTSTR filename);

#endif // !defined(AFX_RENDER_H__32BE33D3_65D6_4A03_9822_E14AF8B2A201__INCLUDED_)
