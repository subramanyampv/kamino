// --------------------------------------------------------------------------------
// <copyright file="SortExpression.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2013
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/04
// * Time: 1:27 μμ
// --------------------------------------------------------------------------------

using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;

namespace NGSoftware.Common
{
	[DataContract]
	public class SortExpression
	{
		private static readonly Regex regex = new Regex("(?<field>[a-zA-Z]+)( (?<order>ASC|DESC))?", RegexOptions.Compiled);

		public SortExpression(string field, SortDirection direction)
		{
			Field = field;
			Direction = direction;
		}

		[DataMember]
		public SortDirection Direction
		{
			get;
			set;
		}

		[DataMember]
		public string Field
		{
			get;
			set;
		}

		public static IEnumerable<SortExpression> Parse(string sortExpression)
		{
			if (!string.IsNullOrEmpty(sortExpression))
			{
				Match m = regex.Match(sortExpression);
				while (m != null && m.Success)
				{
					string field = m.Groups["field"].Value;
					bool isDesc = m.Groups["order"].Value == "DESC";
					yield return new SortExpression(field, isDesc ? SortDirection.Descending : SortDirection.Ascending);
					m = m.NextMatch();
				}
			}
		}

		public override bool Equals(object obj)
		{
			SortExpression that = obj as SortExpression;
			return that != null && Field == that.Field && Direction == that.Direction;
		}

		public override int GetHashCode()
		{
			return Field.GetHashCode() * 13 + (int)Direction;
		}

		public override string ToString()
		{
			return Direction == SortDirection.Descending ? Field + " DESC" : Field;
		}
	}
}