namespace IglooCastle.Core
{
	/// <summary>
	/// Represents the lack of an XML comment.
	/// </summary>
    public sealed class MissingXmlComment : IXmlComment
	{
		/// <summary>
		/// Returns an empty string.
		/// </summary>
		public string Section(string name)
		{
			return string.Empty;
		}

		/// <summary>
		/// Returns an empty string.
		/// </summary>
		public string Section(string sectionName, string attributeName, string attributeValue)
		{
			return string.Empty;
		}
	}
}
