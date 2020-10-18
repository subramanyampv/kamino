// --------------------------------------------------------------------------------
// <copyright file="ReflectionSorter.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;

namespace NGSoftware.Common
{
	public static class ReflectionSorter
	{
		public static List<T> Sort<T>(IEnumerable<T> list, string sortExpression)
		{
			List<T> result = new List<T>(list);
			Sort(result, sortExpression);
			return result;
		}

		public static void Sort<T>(List<T> list, string sortExpression)
		{
			if (string.IsNullOrEmpty(sortExpression))
			{
				return;
			}

			SortExpression[] se = SortExpression.Parse(sortExpression).ToArray();
			if (se.Length <= 0)
			{
				throw new ArgumentException("sortExpression");
			}

			list.Sort((x, y) => Comparer(x, y, se));
		}

		private static int Comparer<T>(T x, T y, SortExpression[] se)
		{
			int result = 0;
			foreach (SortExpression sortExpression in se)
			{
				IComparable xValue = (IComparable)x.GetType().GetProperty(sortExpression.Field).GetValue(x, null);
				IComparable yValue = (IComparable)y.GetType().GetProperty(sortExpression.Field).GetValue(y, null);
				result = sortExpression.Direction == SortDirection.Descending ? yValue.CompareTo(xValue) : xValue.CompareTo(yValue);
				if (result != 0)
				{
					break;
				}
			}

			return result;
		}
	}
}