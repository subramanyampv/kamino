using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NUnit.Framework;

namespace CVRender.Tests
{
	[TestFixture]
	public class TimeAxisTest
	{
		[Test]
		public void Basic()
		{
			TimeAxis axis = new TimeAxis(new DateTime(1980, 12, 5));
			axis.Add(new CVEntry(1986, 1, "Kindergarden"));

			Assert.AreEqual(1, axis.Lanes.Count());
			NonOverlappingTimeAxis lane = axis.Lanes.First();
			Assert.AreEqual(2, lane.Entries.Count());

			TimeAxisEntry first = lane.Entries.ElementAt(0);
			//Assert.AreEqual(12 * 5 + 1, first.TimeSpan.Months);
			Assert.IsNull(first.Entry);

			TimeAxisEntry second = lane.Entries.ElementAt(1);
			//Assert.AreEqual(12, second.TimeSpan.Months);
			Assert.IsNotNull(second.Entry);
		}

		[Test]
		public void Complex()
		{
			TimeAxis axis = new TimeAxis(new DateTime(1980, 12, 5));
			axis.Add(new CVEntry(1986, 1, "Kindergarden"));
			axis.Add(new CVEntry(1987, 6, "Elementary"));

			Assert.AreEqual(1, axis.Lanes.Count(), "Unexpected lanes");
			NonOverlappingTimeAxis lane = axis.Lanes.First();
			Assert.AreEqual(3, lane.Entries.Count(), "Unexpected entries");

			TimeAxisEntry entry = lane.Entries.ElementAt(0);
			//Assert.AreEqual(12 * 5 + 1, entry.TimeSpan.Months);
			Assert.IsNull(entry.Entry);

			entry = lane.Entries.ElementAt(1);
			//Assert.AreEqual(12, entry.TimeSpan.Months);
			Assert.IsNotNull(entry.Entry);

			entry = lane.Entries.ElementAt(2);
			//Assert.AreEqual(6, entry.TimeSpan.Years);
			Assert.IsNotNull(entry.Entry);
		}

		[Test]
		public void MultiLane()
		{
			TimeAxis axis = new TimeAxis(new DateTime(1980, 12, 5));
			axis.Add(new CVEntry(1986, 1, "Kindergarden"));
			axis.Add(new CVEntry(1987, 6, "Elementary"));
			axis.Add(new CVEntry(1989, 7, "English"));

			Assert.AreEqual(2, axis.Lanes.Count(), "Unexpected lanes");

			NonOverlappingTimeAxis lane = axis.Lanes.First();
			Assert.AreEqual(3, lane.Entries.Count(), "Unexpected entries");

			TimeAxisEntry entry = lane.Entries.ElementAt(0);
			//Assert.AreEqual(12 * 5 + 1, entry.TimeSpan.Months);
			Assert.IsNull(entry.Entry);

			entry = lane.Entries.ElementAt(1);
			//Assert.AreEqual(12, entry.TimeSpan.Months);
			Assert.IsNotNull(entry.Entry);

			entry = lane.Entries.ElementAt(2);
			//Assert.AreEqual(6, entry.TimeSpan.Years);
			Assert.IsNotNull(entry.Entry);

			lane = axis.Lanes.Last();
			Assert.AreEqual(2, lane.Entries.Count(), "Unexpected entries");

			entry = lane.Entries.ElementAt(0);
			//Assert.AreEqual(12 * 8 + 1, entry.TimeSpan.Months);
			Assert.IsNull(entry.Entry);

			entry = lane.Entries.ElementAt(1);
			//Assert.AreEqual(7, entry.TimeSpan.Years);
			Assert.IsNotNull(entry.Entry);
		}
	}
}
