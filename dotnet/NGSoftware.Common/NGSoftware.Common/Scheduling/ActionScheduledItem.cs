using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public class ActionScheduledItem : ScheduledItem
	{
		private readonly Action _action;

		public ActionScheduledItem(Action action)
		{
			_action = action;
		}

		public override void Run()
		{
			_action();
		}
	}
}
