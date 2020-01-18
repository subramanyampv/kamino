

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


 /* File created by MIDL compiler version 8.01.0622 */
/* at Tue Jan 19 04:14:07 2038
 */
/* Compiler settings for ChangeFileTimePS.idl:
    Oicf, W1, Zp8, env=Win32 (32b run), target_arch=X86 8.01.0622 
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
/* @@MIDL_FILE_HEADING(  ) */



/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 500
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif /* __RPCNDR_H_VERSION__ */

#ifndef COM_NO_WINDOWS_H
#include "windows.h"
#include "ole2.h"
#endif /*COM_NO_WINDOWS_H*/

#ifndef __ChangeFileTimePS_h_h__
#define __ChangeFileTimePS_h_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef __IChangeFileTimeHandler_FWD_DEFINED__
#define __IChangeFileTimeHandler_FWD_DEFINED__
typedef interface IChangeFileTimeHandler IChangeFileTimeHandler;

#endif 	/* __IChangeFileTimeHandler_FWD_DEFINED__ */


#ifndef __ChangeFileTimeHandler_FWD_DEFINED__
#define __ChangeFileTimeHandler_FWD_DEFINED__

#ifdef __cplusplus
typedef class ChangeFileTimeHandler ChangeFileTimeHandler;
#else
typedef struct ChangeFileTimeHandler ChangeFileTimeHandler;
#endif /* __cplusplus */

#endif 	/* __ChangeFileTimeHandler_FWD_DEFINED__ */


/* header files for imported files */
#include "oaidl.h"
#include "ocidl.h"

#ifdef __cplusplus
extern "C"{
#endif 


#ifndef __IChangeFileTimeHandler_INTERFACE_DEFINED__
#define __IChangeFileTimeHandler_INTERFACE_DEFINED__

/* interface IChangeFileTimeHandler */
/* [unique][helpstring][dual][uuid][object] */ 


EXTERN_C const IID IID_IChangeFileTimeHandler;

#if defined(__cplusplus) && !defined(CINTERFACE)
    
    MIDL_INTERFACE("5FC4D8AB-F704-407C-9E69-CAC0FC0F982E")
    IChangeFileTimeHandler : public IDispatch
    {
    public:
    };
    
    
#else 	/* C style interface */

    typedef struct IChangeFileTimeHandlerVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            IChangeFileTimeHandler * This,
            /* [in] */ REFIID riid,
            /* [annotation][iid_is][out] */ 
            _COM_Outptr_  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            IChangeFileTimeHandler * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            IChangeFileTimeHandler * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            IChangeFileTimeHandler * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            IChangeFileTimeHandler * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            IChangeFileTimeHandler * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            IChangeFileTimeHandler * This,
            /* [annotation][in] */ 
            _In_  DISPID dispIdMember,
            /* [annotation][in] */ 
            _In_  REFIID riid,
            /* [annotation][in] */ 
            _In_  LCID lcid,
            /* [annotation][in] */ 
            _In_  WORD wFlags,
            /* [annotation][out][in] */ 
            _In_  DISPPARAMS *pDispParams,
            /* [annotation][out] */ 
            _Out_opt_  VARIANT *pVarResult,
            /* [annotation][out] */ 
            _Out_opt_  EXCEPINFO *pExcepInfo,
            /* [annotation][out] */ 
            _Out_opt_  UINT *puArgErr);
        
        END_INTERFACE
    } IChangeFileTimeHandlerVtbl;

    interface IChangeFileTimeHandler
    {
        CONST_VTBL struct IChangeFileTimeHandlerVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define IChangeFileTimeHandler_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define IChangeFileTimeHandler_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define IChangeFileTimeHandler_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define IChangeFileTimeHandler_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define IChangeFileTimeHandler_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define IChangeFileTimeHandler_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define IChangeFileTimeHandler_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 


#endif /* COBJMACROS */


#endif 	/* C style interface */




#endif 	/* __IChangeFileTimeHandler_INTERFACE_DEFINED__ */



#ifndef __CHANGEFILETIMEPSLib_LIBRARY_DEFINED__
#define __CHANGEFILETIMEPSLib_LIBRARY_DEFINED__

/* library CHANGEFILETIMEPSLib */
/* [helpstring][version][uuid] */ 


EXTERN_C const IID LIBID_CHANGEFILETIMEPSLib;

EXTERN_C const CLSID CLSID_ChangeFileTimeHandler;

#ifdef __cplusplus

class DECLSPEC_UUID("6736099C-D4FA-4006-8B89-223BC5BAA967")
ChangeFileTimeHandler;
#endif
#endif /* __CHANGEFILETIMEPSLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


