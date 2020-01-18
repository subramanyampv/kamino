using System;
using System.Linq;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Represents an attribute element.
    /// </summary>
    public class AttributeElement : DocumentationElement<Attribute>
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="documentation"></param>
        /// <param name="member"></param>
        public AttributeElement(Documentation documentation, Attribute member) : base(documentation, member)
        {
        }

        #region implemented abstract members of DocumentationElement

        /// <summary>
        /// Gets the XML comment of this element.
        /// </summary>
        public override IXmlComment XmlComment
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        #endregion

        /// <summary>
        /// Gets the attribute type.
        /// </summary>
        public TypeElement AttributeType
        {
            get
            {
                return Documentation.Find(Member.GetType());
            }
        }

        /// <summary>
        /// Checks if the attribute is an instance of one of the given types.
        /// </summary>
        /// <param name="types"></param>
        /// <returns></returns>
        public bool IsInstance(params Type[] types)
        {
            return types.Any(t => t.IsInstanceOfType(Member));
        }
    }
}
