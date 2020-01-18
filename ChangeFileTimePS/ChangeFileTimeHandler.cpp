// ChangeFileTimeHandler.cpp : Implementation of CChangeFileTimeHandler
#include "stdafx.h"
#include "ChangeFileTimePS_h.h"
#include "ChangeFileTimeHandler.h"
#include "SimplePage.h"

/////////////////////////////////////////////////////////////////////////////
// CChangeFileTimeHandler

HRESULT CChangeFileTimeHandler::Initialize(LPCITEMIDLIST pidlFolder, LPDATAOBJECT lpdobj, HKEY hkeyProgID)
{
	FORMATETC etc;
	STGMEDIUM stg;
	TCHAR temp[MAX_PATH];

//	filelist.clear();

	etc.cfFormat = CF_HDROP;
	etc.ptd = NULL;
	etc.dwAspect = DVASPECT_CONTENT;
	etc.lindex = -1; // all of the data
	etc.tymed = TYMED_HGLOBAL; // HGLOBAL
	hasfolders=false;
	if (SUCCEEDED(lpdobj->GetData(&etc, &stg))) {
		HDROP hDrop = (HDROP) stg.hGlobal;
		int fileCount= DragQueryFile(hDrop, 0xFFFFFFFF, NULL, 0);

		for (int i = 0; i < fileCount; i++)
		{
			DragQueryFile(hDrop, i, temp, MAX_PATH);
			if (!hasfolders && (GetFileAttributes(temp) & FILE_ATTRIBUTE_DIRECTORY))
				hasfolders = true;
			filelist.push_back(temp);
		}
		ReleaseStgMedium(&stg);
		return S_OK;
	}
	else
		return E_FAIL;
}

HRESULT CChangeFileTimeHandler::AddPages( LPFNADDPROPSHEETPAGE lpfnAddPage, LPARAM lParam)
{

	InitCommonControls();

	INITCOMMONCONTROLSEX ic;
	ic.dwICC = ICC_DATE_CLASSES;
	ic.dwSize = sizeof(ic);
	InitCommonControlsEx(&ic);

	PROPSHEETPAGE p;
	CSimplePage* newPage = new CSimplePage(filelist, hasfolders);
	ZeroMemory(&p, sizeof(p));
	p.dwSize = sizeof(p);
	p.dwFlags = PSP_USEICONID;
	p.hInstance = _Module.GetModuleInstance();
	p.pszTemplate=MAKEINTRESOURCE(IDD_SIMPLE_PAGE);
	p.pfnDlgProc = (DLGPROC) CSimplePage::dialogProc;
	p.lParam = (LPARAM) newPage;
	p.pszIcon = MAKEINTRESOURCE(IDI_ICON1);
	lpfnAddPage(CreatePropertySheetPage(&p), lParam);

	return NOERROR;
}
