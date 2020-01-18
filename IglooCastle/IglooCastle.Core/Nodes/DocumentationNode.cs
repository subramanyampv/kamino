using System;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    class DocumentationNode : NodeBase
    {
        Documentation documentation;
        public DocumentationNode(Documentation documentation)
        {
            this.documentation = documentation;
        }

        public override string href()
        {
            throw new InvalidOperationException("You are not supposed to write the root node to disk");
        }

        public override string text()
        {
            return null;
        }

        public override IEnumerable<NodeBase> children()
        {
            return documentation.Namespaces.Select(n => new NamespaceNode(n));
        }

        public override string nav_html()
        {
            return string.Format("<ol>{0}</ol>", children_nav_html());
        }

        public Documentation Documentation
        {
            get
            {
                return documentation;
            }
        }
    }
}
