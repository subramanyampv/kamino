// --------------------------------------------------------------------------------
// <copyright file="MessageBusTest.cs" company="Nikolaos Georgiou">
//   Copyright (C) Nikolaos Georgiou 2010-2015
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2015/11/24
// * Time: 08:13:53
// --------------------------------------------------------------------------------
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NGSoftware.Common.Messaging;

namespace NGSoftware.Common.Tests.Messaging
{
	[TestClass]
	public class MessageBusTest
	{
		[TestMethod]
		public void ShouldSendMessageToSubscriber()
		{
			MessageBus messageBus = new MessageBus();
			bool received = false;
			Dummy message = new Dummy();
			Action<Dummy> onDummy = (Dummy msg) => { received = message == msg; };
			messageBus.Subscribe<Dummy>(onDummy);
			messageBus.Publish(message);
			Assert.IsTrue(received);
		}

		[TestMethod]
		public void ShouldSupportMultipleHandlers()
		{
			MessageBus messageBus = new MessageBus();
			bool received1 = false;
			bool received2 = false;
			Dummy message = new Dummy();
			Action<Dummy> onDummy1 = (Dummy msg) => { received1 = message == msg; };
			Action<Dummy> onDummy2 = (Dummy msg) => { received2 = message == msg; };
			messageBus.Subscribe<Dummy>(onDummy1);
			messageBus.Subscribe<Dummy>(onDummy2);
			messageBus.Publish(message);
			Assert.IsTrue(received1, "first handler should receive message");
			Assert.IsTrue(received2, "second handler should receive message");
		}

		[TestMethod]
		public void ShouldSendTheMessageToAllHandlersEvenIfOneFails()
		{
			MessageBus messageBus = new MessageBus();
			bool received1 = false;
			bool received2 = false;
			Dummy message = new Dummy();
			Action<Dummy> onDummy1 = (Dummy msg) => { received1 = message == msg; throw new InvalidOperationException(); };
			Action<Dummy> onDummy2 = (Dummy msg) => { received2 = message == msg; };
			messageBus.Subscribe<Dummy>(onDummy1);
			messageBus.Subscribe<Dummy>(onDummy2);
			Assert.ThrowsException<InvalidOperationException>(() => messageBus.Publish(message));
			Assert.IsTrue(received1, "first handler should receive message");
			Assert.IsTrue(received2, "second handler should receive message");
		}

		[TestMethod]
		public void ShouldAggregateExceptions()
		{
			MessageBus messageBus = new MessageBus();
			bool received1 = false;
			bool received2 = false;
			Dummy message = new Dummy();
			Action<Dummy> onDummy1 = (Dummy msg) => { received1 = message == msg; throw new InvalidOperationException(); };
			Action<Dummy> onDummy2 = (Dummy msg) => { received2 = message == msg; throw new ArgumentNullException(); };
			messageBus.Subscribe<Dummy>(onDummy1);
			messageBus.Subscribe<Dummy>(onDummy2);
			Assert.ThrowsException<AggregateException>(() => messageBus.Publish(message));
			Assert.IsTrue(received1, "first handler should receive message");
			Assert.IsTrue(received2, "second handler should receive message");
		}

		/// <summary>
		/// Dummy message class
		/// </summary>
		class Dummy
		{
		}
	}
}

