// --------------------------------------------------------------------------------
// <copyright file="EnumerableExtensions.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/30
// * Time: 8:40 πμ
// --------------------------------------------------------------------------------

using System.Collections.Generic;
using System.Text;

namespace NGSoftware.Common.Collections
{
	public static class EnumerableExtensions
	{
		public static string ToArrayString<T>(this IEnumerable<T> enumerable)
		{
			if (enumerable == null)
			{
				return string.Empty;
			}

			StringBuilder result = new StringBuilder();
			bool isFirst = true;
			result.Append('[');
			foreach (T element in enumerable)
			{
				if (isFirst)
				{
					isFirst = false;
				}
				else
				{
					result.Append(", ");
				}

				result.Append(element);
			}

			result.Append(']');
			return result.ToString();
		}
	}
}