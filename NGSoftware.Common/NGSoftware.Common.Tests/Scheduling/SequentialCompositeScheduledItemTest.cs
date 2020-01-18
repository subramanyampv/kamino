using NGSoftware.Common.Scheduling;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;

namespace NGSoftware.Common.Tests.Scheduling
{
	[TestClass]
	public class SequentialCompositeScheduledItemTest
	{
		enum State
		{
			Initial,
			Task1,
			Task2
		}

		[TestMethod]
		public void CanRunSequentiallyItems()
		{
			State state = State.Initial;
			ActionScheduledItem task1 = new ActionScheduledItem(() =>
			{
				Assert.AreEqual(State.Initial, state);
				state = State.Task1;
			});

			ActionScheduledItem task2 = new ActionScheduledItem(() =>
			{
				Assert.AreEqual(State.Task1, state);
				state = State.Task2;
			});

			SequentialCompositeScheduledItem seq = new SequentialCompositeScheduledItem(
				Mock.Of<IStoppable>(), task1, task2);
			seq.Run();

			Assert.AreEqual(State.Task2, state);
		}

		[TestMethod]
		public void SequantialRunRespectsStoppable()
		{
			State state = State.Initial;
			Mock<IStoppable> mockStoppable = new Mock<IStoppable>();
			mockStoppable.Setup(p => p.IsStopRequested()).Returns(() => state == State.Task1);
			ActionScheduledItem task1 = new ActionScheduledItem(() =>
			{
				Assert.AreEqual(State.Initial, state);
				state = State.Task1;
			});

			ActionScheduledItem task2 = new ActionScheduledItem(() =>
			{
				throw new InvalidOperationException();
			});

			SequentialCompositeScheduledItem seq = new SequentialCompositeScheduledItem(
				mockStoppable.Object, task1, task2);
			seq.Run();

			Assert.AreEqual(State.Task1, state);
		}
	}
}
