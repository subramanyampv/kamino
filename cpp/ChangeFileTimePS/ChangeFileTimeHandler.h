// ChangeFileTimeHandler.h : Declaration of the CChangeFileTimeHandler

#ifndef __CHANGEFILETIMEHANDLER_H_
#define __CHANGEFILETIMEHANDLER_H_

#include "resource.h"       // main symbols

/////////////////////////////////////////////////////////////////////////////
// CChangeFileTimeHandler
class ATL_NO_VTABLE CChangeFileTimeHandler : 
	public CComObjectRootEx<CComSingleThreadModel>,
	public CComCoClass<CChangeFileTimeHandler, &CLSID_ChangeFileTimeHandler>,
	public IDispatchImpl<IChangeFileTimeHandler, &IID_IChangeFileTimeHandler, &LIBID_CHANGEFILETIMEPSLib>,
	public IShellExtInit,
	public IShellPropSheetExt
{
public:
	CChangeFileTimeHandler()
	{
	}

DECLARE_REGISTRY_RESOURCEID(IDR_CHANGEFILETIMEHANDLER)

DECLARE_PROTECT_FINAL_CONSTRUCT()

BEGIN_COM_MAP(CChangeFileTimeHandler)
	COM_INTERFACE_ENTRY(IChangeFileTimeHandler)
	COM_INTERFACE_ENTRY(IDispatch)
	COM_INTERFACE_ENTRY(IShellExtInit)
	COM_INTERFACE_ENTRY(IShellPropSheetExt)
END_COM_MAP()

private:
	string_list filelist;
	bool hasfolders;
// IChangeFileTimeHandler
public:
    // IShellExtInit
    STDMETHOD(Initialize)(LPCITEMIDLIST, LPDATAOBJECT, HKEY);

    // IShellPropSheetExt
    STDMETHOD(AddPages)(LPFNADDPROPSHEETPAGE, LPARAM);
    STDMETHOD(ReplacePage)(UINT, LPFNADDPROPSHEETPAGE, LPARAM) { return E_NOTIMPL; }
};

#endif //__CHANGEFILETIMEHANDLER_H_
