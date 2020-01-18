// --------------------------------------------------------------------------------
// <copyright file="EnumSortExpression.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace NGSoftware.Common
{
	[DataContract]
	public struct EnumSortExpression<T> : IEquatable<EnumSortExpression<T>>
		where T : struct
	{
		[DataMember]
		public SortDirection Direction
		{
			get;
			set;
		}

		[DataMember]
		public T Field
		{
			get;
			set;
		}

		public static EnumSortExpression<T> Create(T field, SortDirection direction)
		{
			return new EnumSortExpression<T>
			{
				Field = field,
				Direction = direction
			};
		}

		public static EnumSortExpression<T> Asc(T field)
		{
			return EnumSortExpression<T>.Create(field, SortDirection.Ascending);
		}

		public static EnumSortExpression<T> Desc(T field)
		{
			return EnumSortExpression<T>.Create(field, SortDirection.Descending);
		}

		public static IEnumerable<EnumSortExpression<T>> Parse(string input)
		{
			return
				from s in SortExpression.Parse(input)
				select EnumSortExpression<T>.Create((T)Enum.Parse(typeof(T), s.Field, true), s.Direction);
		}

		public bool Equals(EnumSortExpression<T> other)
		{
			return Direction == other.Direction && Field.Equals(other.Field);
		}

		public override bool Equals(object obj)
		{
			if (ReferenceEquals(null, obj))
			{
				return false;
			}

			return obj is EnumSortExpression<T> && Equals((EnumSortExpression<T>)obj);
		}

		public override int GetHashCode()
		{
			unchecked
			{
				return ((int)Direction * 397) ^ Field.GetHashCode();
			}
		}

		public override string ToString()
		{
			return string.Format("{0} {1}", Field, Direction);
		}

		public static bool operator ==(EnumSortExpression<T> left, EnumSortExpression<T> right)
		{
			return left.Equals(right);
		}

		public static bool operator !=(EnumSortExpression<T> left, EnumSortExpression<T> right)
		{
			return !left.Equals(right);
		}
	}
}