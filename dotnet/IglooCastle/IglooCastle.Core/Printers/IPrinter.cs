using IglooCastle.Core.Elements;

namespace IglooCastle.Core.Printers
{
	/// <summary>
	/// A printer formats code elements for various uses.
	/// </summary>
    public interface IPrinter<T> where T : IDocumentationElement
	{
		/// <summary>
		/// Prints the given element.
		/// </summary>
		string Print(T element, bool typeLinks = true);

		/// <summary>
		/// Creates the syntax of the given element.
		/// </summary>
		string Syntax(T element, bool typeLinks = true);

		/// <summary>
		/// Creates the signature of the given element.
		/// </summary>
		string Signature(T element, bool typeLinks = true);

		/// <summary>
		/// Formats the given element.
		/// </summary>
		string Format(T element, string format);
	}
}
