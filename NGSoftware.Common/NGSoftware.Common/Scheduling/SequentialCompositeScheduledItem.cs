using System;
using System.Collections.Generic;
using NGSoftware.Common.Collections;

namespace NGSoftware.Common.Scheduling
{
	public class SequentialCompositeScheduledItem : CompositeScheduledItem
	{
		private readonly IStoppable _stoppable;

		public SequentialCompositeScheduledItem(IStoppable stoppable, params ScheduledItem[] items)
			: base(items)
		{
			_stoppable = stoppable;
		}

		public override void Run()
		{
			foreach (var item in Items)
			{
				if (!_stoppable.IsStopRequested())
				{
					item.Run();
				}
			}
		}

		public override string ToString()
		{
			return "Sequential: " + Items.ToArrayString();
		}
	}
}
