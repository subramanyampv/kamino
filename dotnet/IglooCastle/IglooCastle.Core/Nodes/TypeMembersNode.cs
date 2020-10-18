using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents a node of a type member.
    /// </summary>
    public abstract class TypeMembersNode : NodeBase
    {
        private TypeElement typeElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public TypeMembersNode(TypeElement typeElement)
        {
            this.typeElement = typeElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return typeElement.Filename().Replace("T_", text() + "_");
        }

        /// <summary>
        /// Gets the type element.
        /// </summary>
        protected TypeElement TypeElement
        {
            get { return typeElement; }
        }

        /// <summary>
        /// Creates the HTML template.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", typeElement.ToString("f"), text()),
                h1 = string.Format("{0} {1}", typeElement.ToString("s"), text()),
                main = Helpers.fmt_non_empty(
                    widgetMemberFilter(showInherited: !(this is ConstructorsNode)) + "{0}",
                    main_html_table())
            };

            return htmlTemplate;
        }

        /// <summary>
        /// Checks if this node is empty.
        /// </summary>
        public override bool is_content_empty()
        {
            return !children().Any();
        }

        /// <summary>
        /// Creates the HTML of the main table.
        /// </summary>
        protected abstract string main_html_table();
    }
}
