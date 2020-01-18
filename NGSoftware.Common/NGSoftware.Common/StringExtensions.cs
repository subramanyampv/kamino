// --------------------------------------------------------------------------------
// <copyright file="StringExtensions.cs" company="Nikolaos Georgiou">
//      Copyright (C) Nikolaos Georgiou 2010-2017
// </copyright>
// <author>Nikolaos Georgiou</author>
// * Date: 2013/09/15
// * Time: 8:47 πμ
// --------------------------------------------------------------------------------
namespace NGSoftware.Common
{
	/// <summary>
	/// Extension methods for string.
	/// </summary>
	public static class StringExtensions
	{
		/// <summary>
		/// Converts the string to null if it is empty or whitespace.
		/// </summary>
		public static string ToNullIfEmpty(this string s)
		{
			return string.IsNullOrWhiteSpace(s) ? null : s;
		}

		/// <summary>
		/// Converts the string to a boolean value.
		/// </summary>
		public static bool? ToBoolean(this string s)
		{
			bool result;
			return s != null && bool.TryParse(s, out result) ? result : (bool?)null;
		}

		/// <summary>
		/// Converts line endings to unix.
		/// </summary>
		public static string ToLf(this string s)
		{
			return s.Replace("\r\n", "\n");
		}

		/// <summary>
		/// Gets the hash code of the given string, returning zero if it is null.
		/// </summary>
		public static int SafeHashCode(this string s) => s != null ? s.GetHashCode() : 0;
	}
}
