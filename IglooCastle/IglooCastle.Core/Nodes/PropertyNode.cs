using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Node of a property.
    /// </summary>
    public class PropertyNode : NodeBase
    {
        private PropertyElement propertyElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public PropertyNode(PropertyElement propertyElement)
        {
            this.propertyElement = propertyElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return propertyElement.Filename();
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return propertyElement.Name;
        }

        /// <summary>
        /// Creates the HTML template.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var propertyName = propertyElement.Name;
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", propertyName, "Property"),
                h1 = string.Format("{0}.{1} {2}", propertyElement.OwnerType.ToString("s"), propertyName, "Property"),
                main = Helpers.fmt_non_empty(@"
<h2>Summary</h2>
<p>{0}</p>", propertyElement.XmlComment.Summary()) +
    string.Format(@"
<h2>Syntax</h2>
<code class=""syntax"">
{0}
</code>
", propertyElement.ToSyntax())
            };

            return htmlTemplate;
        }
    }
}
