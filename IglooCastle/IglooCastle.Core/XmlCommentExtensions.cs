namespace IglooCastle.Core
{
	/// <summary>
	/// Extension methods for XML Comments.
	/// </summary>
    public static class XmlCommentExtensions
	{
		/// <summary>
		/// Gets the contents of the summary section.
		/// </summary>
		public static string Summary(this IXmlComment xmlComment)
		{
			return xmlComment.Section("summary");
		}

		/// <summary>
		/// Gets the contents of the returns section.
		/// </summary>
		public static string Returns(this IXmlComment xmlComment)
		{
			return xmlComment.Section("returns");
		}

		/// <summary>
		/// Gets the contents of the given parameter section.
		/// </summary>
		public static string Param(this IXmlComment xmlComment, string paramName)
		{
			return xmlComment.Section("param", "name", paramName);
		}

		/// <summary>
		/// Gets the contents of the given type parameter section.
		/// </summary>
		public static string TypeParam(this IXmlComment xmlComment, string typeParamName)
		{
			return xmlComment.Section("typeparam", "name", typeParamName);
		}
	}
}
