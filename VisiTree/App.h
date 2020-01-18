// Instance.h: initializing the application instance.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_INSTANCE_H__D5518B26_FB7B_45E6_864A_8B10777D09E4__INCLUDED_)
#define AFX_INSTANCE_H__D5518B26_FB7B_45E6_864A_8B10777D09E4__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#include <list>
#include "MessageHandlers.h"

class App
{
private:
	HINSTANCE m_instance;
	CompositeMessageHandler m_messageHandler;
	ATOM MyRegisterClass(HINSTANCE hInstance);
	static App *m_appInstance;

public:
	App(HINSTANCE hInstance);
	virtual ~App();
	WPARAM Run();
	void Add(AbstractMessageHandler *handler) { m_messageHandler.Add(handler); }

	static HINSTANCE Instance()
	{
		return m_appInstance != NULL ? m_appInstance->m_instance : NULL;
	}
};

#endif // !defined(AFX_INSTANCE_H__D5518B26_FB7B_45E6_864A_8B10777D09E4__INCLUDED_)
