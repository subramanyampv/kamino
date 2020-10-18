#if !defined(MESSAGE_HANDLERS_H)
#define MESSAGE_HANDLERS_H

#include "StdAfx.h"
#include <list>

class AbstractMessageHandler
{
public:
	virtual bool Handle(LPMSG msg) = 0;
};

class DefaultMessageHandler : public AbstractMessageHandler
{
public:
	bool Handle(LPMSG msg) override;
};

class DialogMessageHandler : public AbstractMessageHandler
{
private:
	HWND m_wnd;

public:
	DialogMessageHandler(HWND hWnd) : m_wnd(hWnd) {}
	bool Handle(LPMSG msg) override;
};

class CompositeMessageHandler : public AbstractMessageHandler
{
private:
	std::list<AbstractMessageHandler *> m_handlers;

public:
	virtual ~CompositeMessageHandler();
	bool Handle(LPMSG msg) override;
	void Add(AbstractMessageHandler *handler);
};

#endif
