using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// The namespace element.
    /// </summary>
    public class NamespaceElement : DocumentationElement<string>, ITypeContainer
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="documentation">The owner documentation instance.</param>
        /// <param name="name">The name of the namespace.</param>
        public NamespaceElement(Documentation documentation, string name)
            : base(documentation, name)
        {
        }

        /// <summary>
        /// Gets the namespace.
        /// </summary>
        public string Namespace
        {
            get { return Member; }
        }

        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        public override IXmlComment XmlComment
        {
            get
            {
                // TODO: figure out where to read namespace comments from
                return new MissingXmlComment();
            }
        }

        /// <summary>
        /// Gets the types of the documentation that belong to this namespace.
        /// </summary>
        public ICollection<TypeElement> Types
        {
            get { return Documentation.FilterTypes(t => t.Type.Namespace == Namespace); }
        }

        /// <summary>
        /// Gets the methods.
        /// </summary>
        public ICollection<MethodElement> Methods
        {
            get
            {
                return Types.SelectMany(m => m.Methods).ToList();
            }
        }

        /// <summary>
        /// Gets the filename.
        /// </summary>
        public string Filename(string prefix = "N")
        {
            return Documentation.FilenameProvider.Filename(Namespace, prefix);
        }
    }
}
