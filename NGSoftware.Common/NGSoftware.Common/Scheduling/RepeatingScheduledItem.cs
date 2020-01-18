using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public class RepeatingScheduledItem : DecoratorScheduledItem
	{
		private readonly IStoppable _stoppable;
		private readonly int _times;

		public RepeatingScheduledItem(IStoppable stoppable, int times, ScheduledItem decorated)
			: base(decorated)
		{
			_stoppable = stoppable;
			_times = times;
		}

		public override void Run()
		{
			for (int i = 1; i <= _times && !_stoppable.IsStopRequested(); i++)
			{
				base.Run();
			}
		}
	}
}
