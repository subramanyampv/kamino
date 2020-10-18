// --------------------------------------------------------------------------------
// <copyright file="MinMaxAvgValue.cs" company="Nikolaos Georgiou">
//   Copyright (C) Nikolaos Georgiou 2010-2014
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2014/08/09
// * Time: 20:28:00
// --------------------------------------------------------------------------------
using System;

namespace NGSoftware.Common
{
	/// <summary>
	/// Contains a set of values representing a minimum, a maximum and an average value.
	/// </summary>
	public struct MinMaxAvgValue<T> : IEquatable<MinMaxAvgValue<T>> where T : struct
	{
		private readonly T _min;
		private readonly T _max;
		private readonly T _avg;

		public MinMaxAvgValue(T min, T max, T avg)
		{
			_min = min;
			_max = max;
			_avg = avg;
		}

		public T Min
		{
			get
			{
				return _min;
			}
		}

		public T Max
		{
			get
			{
				return _max;
			}
		}

		public T Avg
		{
			get
			{
				return _avg;
			}
		}

		public override string ToString()
		{
			return string.Format("[MinMaxAvgValue: Min={0}, Max={1}, Avg={2}]", Min, Max, Avg);
		}

		public override bool Equals(object obj)
		{
			if (obj == null)
				return false;
			if (ReferenceEquals(this, obj))
				return true;
			if (obj.GetType() != typeof(MinMaxAvgValue<T>))
				return false;
			MinMaxAvgValue<T> other = (MinMaxAvgValue<T>)obj;
			return Equals(other);
		}

		public override int GetHashCode()
		{
			unchecked
			{
				int result = Min.GetHashCode();
				result = result * 11 + Max.GetHashCode();
				result = result * 17 + Avg.GetHashCode();
				return result;
			}
		}

		public bool Equals(MinMaxAvgValue<T> other)
		{
			return Min.Equals(other.Min) && Max.Equals(other.Max) && Avg.Equals(other.Avg);
		}
	}
}
