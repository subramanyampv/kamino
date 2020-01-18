// Render.cpp: implementation of the Render module.
//
//////////////////////////////////////////////////////////////////////

#include "StdAfx.h"
#include "Render.h"

#define LEVEL_HEIGHT 20
#define HORZ_RADIUS 30
#define VERT_RADIUS 15
#define HORZ_SPACE 5
#define THREAD_TWIST 5

void drawNode(pnode node, KeyType keyType, HDC dc, int x, int y, int level)
{
	TCHAR b[30];
	RECT rt;
	POINT points[4];
	int w;

	if (node != NULL)
	{
		w = (1 << level) * (HORZ_SPACE + HORZ_RADIUS);

		Ellipse(dc, x, y, x + 2 * HORZ_RADIUS, y + 2 * VERT_RADIUS);

		switch (keyType)
		{
			case KeyTypeChar:
				_stprintf_s(b, __TEXT("%c"), node->data.c);
				break;
			case KeyTypeInteger:
				_stprintf_s(b, __TEXT("%d"), node->data.i);
				break;
			case KeyTypeFloat:
				_stprintf_s(b, __TEXT("%.3f"), node->data.f);
				break;
			case KeyTypeString:
				_stprintf_s(b, __TEXT("%s"), node->data.s);
				break;
		}

		SetRect(&rt, x, y, x + 2 * HORZ_RADIUS, y + 2 * VERT_RADIUS);
		DrawText(dc, b, -1, &rt, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

		// poso ua megalosei to R toy L kai to L toy R ?

		if (node->left)
		{
			points[0].x = x + HORZ_RADIUS;
			points[0].y = y + 2 * VERT_RADIUS; // circle most bottom point
			points[1].x = points[0].x;
			points[1].y = points[0].y + THREAD_TWIST;
			points[2].x = points[0].x - w;
			points[2].y = points[1].y + LEVEL_HEIGHT - 2 * THREAD_TWIST;
			points[3].x = points[2].x;
			points[3].y = points[2].y + THREAD_TWIST;

			Polyline(dc, points, 4);
			drawNode(node->left,
					 keyType,
					 dc,
					 x - w,
					 y + 2 * VERT_RADIUS + LEVEL_HEIGHT,
					 level - 1);
		}
		if (node->right)
		{
			points[0].x = x + HORZ_RADIUS;
			points[0].y = y + 2 * VERT_RADIUS; // circle most bottom point
			points[1].x = points[0].x;
			points[1].y = points[0].y + THREAD_TWIST;
			points[2].x = points[0].x + w;
			points[2].y = points[1].y + LEVEL_HEIGHT - 2 * THREAD_TWIST;
			points[3].x = points[2].x;
			points[3].y = points[2].y + THREAD_TWIST;

			Polyline(dc, points, 4);
			drawNode(node->right,
					 keyType,
					 dc,
					 x + w,
					 y + 2 * VERT_RADIUS + LEVEL_HEIGHT,
					 level - 1);
		}
	}
}

int calcTreeHeight(pnode node)
{
	if (node != NULL)
	{
		int h1, h2;
		h1 = 1 + calcTreeHeight(node->left);
		h2 = 1 + calcTreeHeight(node->right);
		return (h1 > h2) ? h1 : h2;
	}
	return 0;
}

void calcTreeRect(pnode root, LPRECT rt)
{
	int height;
	rt->left  = 0;
	rt->top   = 0;
	rt->right = 0;
	height    = calcTreeHeight(root);
	for (int i = 0; i <= height - 2; i++)
		rt->right += 2 * ((1 << i) * (HORZ_SPACE + HORZ_RADIUS));
	rt->right += 2 * HORZ_RADIUS;
	rt->bottom = height * (2 * VERT_RADIUS + LEVEL_HEIGHT) - LEVEL_HEIGHT;
}

void render(AbstractTree *mytree, LPRECT rt, HDC hdc)
{
	// HFONT oldFont;
	SetBkMode(hdc, TRANSPARENT);
	SelectObject(hdc, GetStockObject(WHITE_PEN));
	Rectangle(hdc, rt->left, rt->top, rt->right - 1, rt->bottom - 1);
	SelectObject(hdc, GetStockObject(BLACK_PEN));
	/*oldFont = */ SelectObject(hdc, GetStockObject(ANSI_VAR_FONT));
	drawNode(mytree->GetRoot(),
			 mytree->GetKeyType(),
			 hdc,
			 rt->right / 2 - HORZ_RADIUS,
			 rt->top,
			 calcTreeHeight(mytree->GetRoot()) - 2);
	// Delete
}

#define PIXELSXTODMM(hdc, x) (x) * 2540 / GetDeviceCaps(hdc, LOGPIXELSX)
#define PIXELSYTODMM(hdc, y) (y) * 2540 / GetDeviceCaps(hdc, LOGPIXELSY)

void renderMetafile(AbstractTree *mytree, HWND hWnd, LPCTSTR filename)
{
	HDC hdc1 = GetDC(hWnd);
	RECT rt;

	calcTreeRect(mytree->GetRoot(), &rt);
	rt.right  = PIXELSXTODMM(hdc1, rt.right);
	rt.bottom = PIXELSYTODMM(hdc1, rt.bottom);
	HDC hdc   = CreateEnhMetaFile(hdc1, filename, &rt, NULL);
	calcTreeRect(mytree->GetRoot(), &rt);
	render(mytree, &rt, hdc);
	HENHMETAFILE hmetafile = CloseEnhMetaFile(hdc);
	DeleteEnhMetaFile(hmetafile);
}
