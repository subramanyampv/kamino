// --------------------------------------------------------------------------------
// <copyright file="MessageBus.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Messaging
{

	public class MessageBus : IMessageBus
	{
		private readonly Dictionary<Type, List<Delegate>> _handlers = new Dictionary<Type, List<Delegate>>();

		public void Publish<T>(T message)
		{
			List<Exception> exceptions = new List<Exception>();
			foreach (Delegate d in Ensure<T>())
			{
				Action<T> action = (Action<T>)d;
				try
				{
					action(message);
				}
				catch (Exception ex)
				{
					exceptions.Add(ex);
				}
			}

			if (exceptions.Count > 1)
			{
				throw new AggregateException(exceptions);
			}
			else if (exceptions.Count == 1)
			{
				throw exceptions[0];
			}
		}

		public void Subscribe<T>(Action<T> handler)
		{
			Ensure<T>().Add(handler);
		}

		public void Unsubscribe<T>(Action<T> handler)
		{
			List<Delegate> list = Ensure<T>();
			list.RemoveAll(p => p == (Delegate)handler);
		}

		private List<Delegate> Ensure<T>()
		{
			Type type = typeof(T);
			if (_handlers.ContainsKey(type))
			{
				return _handlers[type];
			}

			List<Delegate> result = new List<Delegate>();
			_handlers.Add(type, result);
			return result;
		}
	}
}