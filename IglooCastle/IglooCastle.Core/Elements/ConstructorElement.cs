using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// The constructor element.
    /// </summary>
    public class ConstructorElement : MethodBaseElement<ConstructorInfo>
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public ConstructorElement(Documentation documentation, TypeElement ownerType, ConstructorInfo constructor) :
            base(documentation, ownerType, constructor)
        {
        }

        internal ConstructorInfo Constructor
        {
            get { return Member; }
        }

        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        protected override IXmlComment GetXmlComment()
        {
            // M:IglooCastle.CLI.NamespaceElement.#ctor(IglooCastle.CLI.Documentation)
            return Documentation.GetMethodDocumentation(OwnerType.Type, "#ctor", Constructor.GetParameters());
        }

        /// <summary>
        /// Gets the filename.
        /// </summary>
        public string Filename()
        {
            return Documentation.FilenameProvider.Filename(Member);
        }

        /// <summary>
        /// Gets the link.
        /// </summary>
        public string Link()
        {
            if (DeclaringType.IsLocalType)
            {
                return Documentation.FilenameProvider.Filename(Member);
            }

            return null;
        }
    }
}
