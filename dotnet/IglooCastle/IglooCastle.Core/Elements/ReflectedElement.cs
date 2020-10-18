using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// An element that uses reflection.
    /// </summary>
    public abstract class ReflectedElement<T> : DocumentationElement<T>
        where T : MemberInfo
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        protected ReflectedElement(Documentation documentation, T member)
            : base(documentation, member)
        {
        }

        /// <summary>
        /// Gets the name of the reflected element.
        /// </summary>
        /// <seealso cref="MemberInfo.Name"/>
        public string Name
        {
            get { return Member.Name; }
        }

        /// <summary>
        /// Gets the namespace element.
        /// </summary>
        public abstract NamespaceElement NamespaceElement
        {
            get;
        }

        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        public override IXmlComment XmlComment
        {
            get { return GetXmlComment() ?? new MissingXmlComment(); }
        }

        /// <summary>
        /// Checks if the given attribute is present.
        /// </summary>
        public bool HasAttribute(string attributeName)
        {
            return Member.GetCustomAttributes().Any(a => a.GetType().FullName == attributeName || a.GetType().FullName == attributeName + "Attribute");
        }

        /// <summary>
        /// Gets the custom attributes.
        /// </summary>
        public IEnumerable<CustomAttributeDataElement> GetCustomAttributesData()
        {
            return Member.GetCustomAttributesData().Select(a => new CustomAttributeDataElement(Documentation, a)).ToList();
        }

        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        protected abstract IXmlComment GetXmlComment();
    }
}
