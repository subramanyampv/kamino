#include "MessageHandlers.h"

bool DefaultMessageHandler::Handle(LPMSG msg)
{
	TranslateMessage(msg);
	DispatchMessage(msg);
	return true;
}

bool DialogMessageHandler::Handle(LPMSG msg)
{
	return IsDialogMessage(m_wnd, msg);
}

CompositeMessageHandler::~CompositeMessageHandler()
{
	for (auto x : m_handlers)
	{
		delete x;
	}
}

bool CompositeMessageHandler::Handle(LPMSG msg)
{
	for (auto x : m_handlers)
	{
		if (x->Handle(msg))
		{
			return true;
		}
	}

	return false;
}

void CompositeMessageHandler::Add(AbstractMessageHandler *handler)
{
	m_handlers.push_front(handler);
}
