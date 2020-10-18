using Moq;
using NGSoftware.Common.Scheduling;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace NGSoftware.Common.Tests.Scheduling
{
	[TestClass]
	public class LongRunningScheduledItemTest
	{
		[TestMethod]
		public void LongRunningScheduledItemRespectsStoppable()
		{
			// shared counter for thread coordination
			var i = 0;
			var mockStoppable = new Mock<IStoppable>();

			// stop if the counter has been incremented
			mockStoppable.Setup(x => x.IsStopRequested()).Returns(() => (i > 0));

			// create the basic task
			var basicTask = new ActionScheduledItem(() => { i++; });

			var longRunningTask = new LongRunningScheduledItem(mockStoppable.Object, basicTask);
			longRunningTask.Run();

			// verify the counter is incremented only once
			Assert.AreEqual(1, i);
		}
	}
}
