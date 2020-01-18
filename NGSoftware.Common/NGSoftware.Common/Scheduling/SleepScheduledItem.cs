using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public class SleepScheduledItem : ScheduledItem
	{
		private readonly IStoppable _stoppable;
		private readonly TimeSpan _duration;

		public SleepScheduledItem(IStoppable stoppable, TimeSpan duration)
		{
			_stoppable = stoppable;
			_duration = duration;
		}

		public override void Run()
		{
			_stoppable.Sleep(_duration);
		}
	}
}
