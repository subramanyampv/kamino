using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    class ClassDiagramNode : NodeBase
    {
        private NamespaceElement namespaceElement;

        public ClassDiagramNode(NamespaceElement namespaceElement)
        {
            this.namespaceElement = namespaceElement;
        }

        public override string href()
        {
            return namespaceElement.Filename(prefix: "ClassDiagram");
        }

        public override string text()
        {
            return "Class Diagram";
        }

        public Documentation Documentation
        {
            get
            {
                return namespaceElement.Documentation;
            }
        }

        public override HtmlTemplate contents_html_template()
        {
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} Class Diagram", namespaceElement.Namespace),

                // ignore static types
                // take types with no base class or base class outside the documentation scope
                main = _ul(namespaceElement.Types.Where(t => !t.IsStatic && (t.BaseType == null || !t.BaseType.IsLocalType)))
            };

            return htmlTemplate;
        }

        private string _ul(IEnumerable<TypeElement> types)
        {
            var html = string.Join("\n", types.Select(t => "<li>" + t.ToHtml() + _ul(t.GetChildTypes()) + "</li>"));
            return Helpers.fmt_non_empty("<ul>{0}</ul>", html);
        }
    }
}
