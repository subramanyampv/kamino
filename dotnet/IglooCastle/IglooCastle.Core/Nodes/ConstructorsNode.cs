using IglooCastle.Core.Elements;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Renders information about the constructors of a class.
    /// </summary>
    public class ConstructorsNode : TypeMembersNode
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public ConstructorsNode(TypeElement typeElement) : base(typeElement)
        {
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return "Constructors";
        }

        /// <summary>
        /// Gets the child nodes.
        /// </summary>
        public override IEnumerable<NodeBase> children()
        {
            return TypeElement.Constructors.Select(c => new ConstructorNode(c));
        }

        /// <summary>
        /// Renders the main HTML table.
        /// </summary>
        protected override string main_html_table()
        {
            return constructors_table(TypeElement.Constructors);
        }
    }
}
