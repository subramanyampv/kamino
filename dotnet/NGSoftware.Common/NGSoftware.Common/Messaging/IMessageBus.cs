// --------------------------------------------------------------------------------
// <copyright file="IMessageBus.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------

using System;

namespace NGSoftware.Common.Messaging
{
	/// <summary>
	/// A message bus.
	/// </summary>
	public interface IMessageBus
	{
		/// <summary>
		/// Publish the specified message to the bus.
		/// </summary>
		/// <param name="message">The message to send.</param>
		/// <typeparam name="T">The type of the message.</typeparam>
		void Publish<T>(T message);

		/// <summary>
		/// Subscribe to messages of the given type.
		/// </summary>
		/// <param name="handler">The message handler.</param>
		/// <typeparam name="T">The type of the message.</typeparam>
		void Subscribe<T>(Action<T> handler);

		/// <summary>
		/// Unsubscribe from message of the given type.
		/// </summary>
		/// <param name="handler">The handler to unsubscribe.</param>
		/// <typeparam name="T">The type of the message.</typeparam>
		void Unsubscribe<T>(Action<T> handler);
	}
}