// --------------------------------------------------------------------------------
// <copyright file="MinMaxValue.cs" company="Nikolaos Georgiou">
//   Copyright (C) Nikolaos Georgiou 2010-2014
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2014/08/09
// * Time: 18:36:26
// --------------------------------------------------------------------------------
using System;
using System.Runtime.Serialization;

namespace NGSoftware.Common
{
	/// <summary>
	/// Contains a pair of values representing a minimum and a maximum boundary.
	/// </summary>
	[DataContract]
	public struct MinMaxValue<T> : IEquatable<MinMaxValue<T>> where T : struct
	{
		[DataMember]
		public T Min
		{
			get;
			set;
		}

		[DataMember]
		public T Max
		{
			get;
			set;
		}

		public override string ToString()
		{
			return string.Format("[MinMaxValue: Min={0}, Max={1}]", Min, Max);
		}

		public override bool Equals(object obj)
		{
			if (obj == null)
				return false;
			if (ReferenceEquals(this, obj))
				return true;
			if (obj.GetType() != typeof(MinMaxValue<T>))
				return false;
			MinMaxValue<T> other = (MinMaxValue<T>)obj;
			return Equals(other);
		}

		public override int GetHashCode()
		{
			unchecked
			{
				return Min.GetHashCode() ^ Max.GetHashCode();
			}
		}

		public bool Equals(MinMaxValue<T> other)
		{
			return Min.Equals(other.Min) && Max.Equals(other.Max);
		}
	}
}
