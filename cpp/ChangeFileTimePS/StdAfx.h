// stdafx.h : include file for standard system include files,
//      or project specific include files that are used frequently,
//      but are changed infrequently

#if !defined(AFX_STDAFX_H__2F4EC3E0_9FC7_4974_AC23_B73EEBFB947A__INCLUDED_)
#define AFX_STDAFX_H__2F4EC3E0_9FC7_4974_AC23_B73EEBFB947A__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#define STRICT
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0400
#endif
#define _ATL_APARTMENT_THREADED

#include <atlbase.h>
//You may derive a class from CComModule and use it if you want to override
//something, but do not change the name of _Module
extern CComModule _Module;
#include <atlcom.h>
#include <comdef.h>
#include <shlobj.h>

class string_list {
private:
	LPTSTR *data;
	int size;
	int capacity;

	void ensureSize(int reqsize) {
		if (reqsize > capacity) {
			LPTSTR *temp = new LPTSTR[capacity = reqsize * 2];
			for (int i = 0; i < size; i++)
				temp[i] = data[i];
			for (int j = size; j < capacity; j++)
				temp[j] = new TCHAR[MAX_PATH];
			
			delete[] data;
			data = temp;
		}

		size = reqsize;
	}
public:

	string_list() {
		size = 0;
		capacity = 1;
		data = new LPTSTR[1];
		data[0] = new TCHAR[MAX_PATH];
	}

	virtual ~string_list() {
		for (int i = 0; i < capacity; i++)
			delete data[i];
		delete[] data;
	}

	int getSize() {
		return size;
	}

	LPTSTR getAt(int i) {
		return data[i];
	}

	LPTSTR operator [] (int i) {
		return data[i];
	}

	LPTSTR push_back(LPCTSTR sz) {
		ensureSize(size + 1);
		lstrcpy(data[size-1], sz);
		return data[size-1];
	}
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_STDAFX_H__2F4EC3E0_9FC7_4974_AC23_B73EEBFB947A__INCLUDED)
