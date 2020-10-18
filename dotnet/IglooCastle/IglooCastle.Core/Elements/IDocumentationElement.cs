namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Represents a documentation element.
    /// </summary>
    public interface IDocumentationElement
    {
        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        IXmlComment XmlComment { get; }
    }
}
