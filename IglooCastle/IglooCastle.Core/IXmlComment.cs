namespace IglooCastle.Core
{
	/// <summary>
	/// Holds the XML documentation of a code element.
	/// </summary>
    public interface IXmlComment
	{
		/// <summary>
		/// Gets the XML documentation of the given section.
		/// </summary>
		string Section(string sectionName);

		/// <summary>
		/// Gets the XML documentation identified by the given parameters.
		/// </summary>
		string Section(string sectionName, string attributeName, string attributeValue);
	}
}
