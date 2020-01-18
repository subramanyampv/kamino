namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// This is the root of all documentation elements.
    /// </summary>
    /// <typeparam name="TMember">The type of the member that this class documents.</typeparam>
    public abstract class DocumentationElement<TMember> : IDocumentationElement
    {
        private readonly Documentation _documentation;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="documentation"></param>
        /// <param name="member"></param>
        protected DocumentationElement(Documentation documentation, TMember member)
        {
            _documentation = documentation;
            Member = member;
        }

        /// <summary>
        /// Gets the XML comment that documents this code element.
        /// </summary>
        /// <remarks>
        /// This value will never be <c>null</c>.
        /// </remarks>
        /// <value>The XML comment.</value>
        public abstract IXmlComment XmlComment { get; }

        /// <summary>
        /// Gets the underlying code member.
        /// </summary>
        public TMember Member { get; private set; }

        /// <summary>
        /// Gets the documentation element.
        /// </summary>
        public Documentation Documentation
        {
            get { return _documentation; }
        }

        /// <summary>
        /// Checks if this object equals the given object.
        /// </summary>
        /// <param name="o"></param>
        /// <returns></returns>
        public override bool Equals(object o)
        {
            if (ReferenceEquals(o, null))
            {
                return false;
            }

            if (ReferenceEquals(o, this))
            {
                return true;
            }

            if (o.GetType() != GetType())
            {
                return false;
            }

            DocumentationElement<TMember> that = (DocumentationElement<TMember>)o;
            return Member.Equals(that.Member);
        }

        /// <summary>
        /// Gets the hash code for this instance.
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            return Member.GetHashCode();
        }
        
        /// <summary>
        /// Formats this object as a string.
        /// </summary>
        /// <returns></returns>
        public sealed override string ToString()
        {
            return Member.ToString();
        }        
    }
}
