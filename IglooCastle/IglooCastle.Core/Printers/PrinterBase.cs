using IglooCastle.Core.Elements;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Printers
{
	/// <summary>
	/// Base class for all printer classes.
	/// </summary>
    public abstract class PrinterBase<T> : IPrinter<T>
        where T : IDocumentationElement
	{
		private readonly Documentation _documentation;

		/// <summary>
		/// Creates an instance of this class.
		/// </summary>
		protected PrinterBase(Documentation documentation)
		{
			_documentation = documentation;
		}

		/// <summary>
		/// Gets the documentation.
		/// </summary>
		public Documentation Documentation{ get { return _documentation; } }

		/// <summary>
		/// Formats the given element.
		/// </summary>
        public virtual string Format(T element, string format)
		{
			switch (format)
			{
				case "x":
					return Syntax(element, typeLinks: false);
				case "X":
					return Syntax(element, typeLinks: true);
				default:
					return element.ToString();
			}
		}

		/// <summary>
		/// Prints the given element.
		/// </summary>
        public abstract string Print(T element, bool typeLinks = true);

		/// <summary>
		/// Creates the signature of the given element.
		/// </summary>
        public abstract string Signature(T element, bool typeLinks = true);

		/// <summary>
		/// Creates the syntax of the given element.
		/// </summary>
        public abstract string Syntax(T element, bool typeLinks = true);

		/// <summary>
		/// Creates the syntax of the given attributes.
		/// </summary>
        protected string SyntaxOfAttributes<TElement>(ReflectedElement<TElement> element, bool typeLinks)
			where TElement : MemberInfo
		{
			return string.Join("", element.GetCustomAttributesData().Select(customAttributeDataElement => customAttributeDataElement.ToSyntax(typeLinks)));
		}
	}
}
