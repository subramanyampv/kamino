using System;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
	/// <summary>
	/// The custom attribute data element.
	/// </summary>

    public class CustomAttributeDataElement : DocumentationElement<CustomAttributeData>
	{
		/// <summary>
		/// Creates an instance of this class.
		/// </summary>
		public CustomAttributeDataElement(Documentation documentation, CustomAttributeData member) : base(documentation, member)
		{
		}

		/// <summary>
		/// Gets the XML comment.
		/// </summary>
		public override IXmlComment XmlComment
		{
			get
			{
				throw new NotImplementedException();
			}
		}

		/// <summary>
		/// Gets the attribute type.
		/// </summary>
		public TypeElement AttributeType
		{
			get
			{
				return Documentation.Find(Member.AttributeType);
			}
		}
	}
}
