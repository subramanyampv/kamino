// --------------------------------------------------------------------------------
// <copyright file="QueueSet.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/10/07
// * Time: 8:57 πμ
// --------------------------------------------------------------------------------
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace NGSoftware.Common.Collections
{
	/// <summary>
	/// A thread-safe queue that rejects duplicate items.
	/// </summary>
	/// <typeparam name="TKey">
	/// The type of the keys in the queue
	/// </typeparam>
	/// <typeparam name="TValue">
	/// The type of the values in the queue
	/// </typeparam>
	public class QueueSet<TKey, TValue>
	{
		private readonly Dictionary<TKey, TValue> _dictionary = new Dictionary<TKey, TValue>();
		private readonly LinkedList<TKey> _orderedKeys = new LinkedList<TKey>();
		private readonly object _mutex = new object();
		private readonly Dictionary<TKey, DateTime> _keyAge = new Dictionary<TKey, DateTime>();
		private readonly TimeSpan _recentAge;

		public QueueSet(TimeSpan recentAge)
		{
			_recentAge = recentAge;
		}

		public int Count
		{
			get
			{
				lock (_mutex)
				{
					return _dictionary.Count;
				}
			}
		}

		public bool Push(TKey key, TValue value)
		{
			lock (_mutex)
			{
				if (_dictionary.ContainsKey(key))
				{
					// already in the dictionary
					return false;
				}

				if (WasRecentlyAdded(key))
				{
					// not adding it again, it was added recently
					return false;
				}

				_orderedKeys.AddLast(key);
				_dictionary.Add(key, value);
				return true;
			}
		}

		private bool WasRecentlyAdded(TKey key)
		{
			if (!_keyAge.ContainsKey(key))
			{
				_keyAge.Add(key, DateTime.UtcNow);
				return false;
			}

			DateTime addedOn = _keyAge[key];
			if (IsRecentDate(addedOn))
			{
				return true;
			}

			_keyAge[key] = DateTime.UtcNow;
			return false;
		}

		private bool IsRecentDate(DateTime dt)
		{
			return DateTime.UtcNow.Subtract(dt) <= _recentAge;
		}

		public bool TryPop(out TValue item)
		{
			lock (_mutex)
			{
				var first = _orderedKeys.First;
				if (first == null)
				{
					item = default(TValue);
					return false;
				}

				var key = first.Value;
				item = _dictionary[key];
				_orderedKeys.RemoveFirst();
				_dictionary.Remove(key);
				return true;
			}
		}

		public IEnumerable<TKey> Keys()
		{
			lock (_mutex)
			{
				return _orderedKeys.ToArray();
			}
		}
	}
}