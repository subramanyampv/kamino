// --------------------------------------------------------------------------------
// <copyright file="DictionaryExtensions.cs" company="Nikolaos Georgiou">
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
	/// Extension methods for Dictionary.
	/// </summary>
	public static class DictionaryExtensions
	{
		/// <summary>
		/// Starts a merge operation for this dictionary.
		/// A merge operation will add missing elements and update existing elements.
		/// The values have the key as a property too.
		/// </summary>
		/// <typeparam name="TKey">
		/// The type of the dictionary key.
		/// </typeparam>
		/// <typeparam name="TValue">
		/// The type of the dictionary value.
		/// </typeparam>
		/// <param name="dictionary">
		/// This dictionary.
		/// </param>
		/// <param name="initAction">
		/// A method that sets the key on a newly created value.
		/// </param>
		/// <returns>
		/// A fluent interface to begin the merging operations.
		/// </returns>
		public static DictionaryMerger<TKey, TValue> StartMerge<TKey, TValue>(
			this Dictionary<TKey, TValue> dictionary, 
			Action<TValue, TKey> initAction)
			where TValue : new()
		{
			return new DictionaryMerger<TKey, TValue>(dictionary, initAction);
		}
	}
}