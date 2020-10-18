using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Scheduling
{
	/// <summary>
	/// A scheduled item.
	/// </summary>
	public abstract class ScheduledItem
	{
		/// <summary>
		/// Runs this scheduled item.
		/// </summary>
		public abstract void Run();
	}
}
