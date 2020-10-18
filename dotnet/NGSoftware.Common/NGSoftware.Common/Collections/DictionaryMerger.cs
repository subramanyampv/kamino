// --------------------------------------------------------------------------------
// <copyright file="DictionaryMerger.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/14
// * Time: 9:07 μμ
// --------------------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace NGSoftware.Common.Collections
{
	/// <summary>
	/// The implementation of Dictionary Merger.
	/// </summary>
	/// <typeparam name="TKey">
	/// The type of the keys of the dictionary.
	/// </typeparam>
	/// <typeparam name="TValue">
	/// The type of the values of the dictionary.
	/// </typeparam>
	public sealed class DictionaryMerger<TKey, TValue> where TValue : new()
	{
		/// <summary>
		/// Holds a reference to the dictionary we're merging into.
		/// </summary>
		private readonly Dictionary<TKey, TValue> _dictionary;

		/// <summary>
		/// The action that is used to initialize a value with its key.
		/// Values in the dictionary have a property containing the key.
		/// </summary>
		private readonly Action<TValue, TKey> _initAction;

		/// <summary>
		/// Initializes a new instance of the <see cref="DictionaryMerger{TKey,TValue}"/> class.
		/// </summary>
		/// <param name="dictionary">
		/// The underlying dictionary.
		/// </param>
		/// <param name="initAction">
		/// The action that is used to initialize a value with its key.
		/// Values in the dictionary have a property containing the key.
		/// </param>
		public DictionaryMerger(Dictionary<TKey, TValue> dictionary, Action<TValue, TKey> initAction)
		{
			_dictionary = dictionary;
			_initAction = initAction;
		}

		/// <summary>
		/// Gets the values of the underlying dictionary.
		/// </summary>
		public IEnumerable<TValue> Values
		{
			get { return _dictionary.Values; }
		}

		/// <summary>
		/// Merges the given dictionary into the underlying dictionary.
		/// </summary>
		/// <typeparam name="TPartValue">
		/// The type of the values of the dictionary to be merged.
		/// </typeparam>
		/// <param name="partDictionary">
		/// The dictionary that will be merged into the underlying dictionary.
		/// </param>
		/// <param name="action">
		/// An action that assigns the part value into the corresponding value of the underlying dictionary.
		/// </param>
		/// <returns>
		/// The instance of this object, to chain more merging operations or to get the final merged values.
		/// </returns>
		public DictionaryMerger<TKey, TValue> Merge<TPartValue>(Dictionary<TKey, TPartValue> partDictionary, 
		                                                        Action<TValue, TPartValue> action)
		{
			foreach (KeyValuePair<TKey, TPartValue> kv in partDictionary)
			{
				TValue us;
				if (!_dictionary.ContainsKey(kv.Key))
				{
					us = new TValue();
					_initAction(us, kv.Key);
					_dictionary.Add(kv.Key, us);
				}
				else
				{
					us = _dictionary[kv.Key];
				}

				action(us, kv.Value);
			}

			return this;
		}
	}
}