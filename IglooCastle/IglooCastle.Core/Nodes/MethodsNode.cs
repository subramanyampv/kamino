using IglooCastle.Core.Elements;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Lists all methods of a type.
    /// </summary>
    public class MethodsNode : TypeMembersNode
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public MethodsNode(TypeElement typeElement) : base(typeElement)
        {
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return "Methods";
        }

        /// <summary>
        /// Gets the children.
        /// </summary>
        public override IEnumerable<NodeBase> children()
        {
            return TypeElement.Methods.Where(p => !p.IsInherited).Select(c => new MethodNode(c));
        }

        /// <summary>
        /// Renders the main HTML table.
        /// </summary>
        protected override string main_html_table()
        {
            return methods_table(TypeElement.Methods);
        }
    }
}
