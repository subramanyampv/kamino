using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	public class DecoratorScheduledItem : ScheduledItem
	{
		private readonly ScheduledItem _decorated;

		public DecoratorScheduledItem(ScheduledItem decorated)
		{
			if (decorated == null)
			{
				throw new ArgumentNullException("decorated");
			}

			_decorated = decorated;
		}

		public ScheduledItem Decorated
		{
			get
			{
				return _decorated;
			}
		}

		public override void Run()
		{
			_decorated.Run();
		}

		public override string ToString()
		{
			return GetType().Name + ": " + Decorated.ToString();
		}
	}
}
