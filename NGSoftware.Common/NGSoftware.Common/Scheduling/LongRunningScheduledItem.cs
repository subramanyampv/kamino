using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public class LongRunningScheduledItem : DecoratorScheduledItem
	{
		private readonly IStoppable _stoppable;

		public LongRunningScheduledItem(IStoppable stoppable, ScheduledItem decorated)
			: base(decorated)
		{
			_stoppable = stoppable;
		}

		public override void Run()
		{
			while (!_stoppable.IsStopRequested())
			{
				base.Run();
			}
		}
	}
}
