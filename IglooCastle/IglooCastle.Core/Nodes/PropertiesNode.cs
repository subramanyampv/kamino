using IglooCastle.Core.Elements;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// A node listing all properties of a type.
    /// </summary>
    public class PropertiesNode : TypeMembersNode
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public PropertiesNode(TypeElement typeElement) : base(typeElement)
        {
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return "Properties";
        }

        /// <summary>
        /// Gets the child nodes.
        /// </summary>
        public override IEnumerable<NodeBase> children()
        {
            return TypeElement.Properties.Where(p => !p.IsInherited).Select(c => new PropertyNode(c));
        }

        /// <summary>
        /// Renders the main html table.
        /// </summary>
        protected override string main_html_table()
        {
            return properties_table(TypeElement.Properties);
        }
    }
}
