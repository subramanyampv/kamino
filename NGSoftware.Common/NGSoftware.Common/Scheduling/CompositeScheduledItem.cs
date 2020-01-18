using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public abstract class CompositeScheduledItem : ScheduledItem
	{
		private readonly ScheduledItem[] _items;

		public CompositeScheduledItem(params ScheduledItem[] items)
		{
			_items = items;
		}

		public ScheduledItem[] Items
		{
			get
			{
				return _items;
			}
		}
	}
}
