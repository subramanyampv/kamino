using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    class NamespaceNode : NodeBase
    {
        private NamespaceElement namespaceElement;

        public NamespaceNode(NamespaceElement namespaceElement)
        {
            this.namespaceElement = namespaceElement;
        }

        public override string href()
        {
            return namespaceElement.Filename();
        }

        public override string text()
        {
            return namespaceElement.Namespace + " Namespace";
        }

        public override IEnumerable<NodeBase> children()
        {
            List<NodeBase> result = new List<NodeBase>();
            foreach (var type in namespaceElement.Types)
            {
                if (type.IsEnum)
                {
                    result.Add(new EnumNode(type));
                }
                else
                {
                    result.Add(new TypeNode(type));
                }
            }

            result.Add(new ExtensionMethodsNode(namespaceElement));
            result.Add(new ClassDiagramNode(namespaceElement));
            return result.filter_empty();
        }

        public override HtmlTemplate contents_html_template()
        {
            var htmlTemplate = new HtmlTemplate
            {
                title = text(),
                main = string.Join("\n",
                _table("Classes", namespaceElement.Types.Where(t => t.IsClass)),
                _table("Interfaces", namespaceElement.Types.Where(t => t.IsInterface)),
                _table("Enumerations", namespaceElement.Types.Where(t => t.IsEnum)))
            };

            // TODO: Delegates

            return htmlTemplate;
        }

        public Documentation Documentation
        {
            get
            {
                return namespaceElement.Documentation;
            }
        }

        private string table_row(TypeElement element)
        {
            return string.Format(@"
<tr>
<td>{0}</td>
<td>{1}</td>
</tr>", element.ToHtml(), element.XmlComment.Summary() ?? "&nbsp;");
        }

        private string _table(string title, IEnumerable<TypeElement> types)
        {
            return Helpers.fmt_non_empty("<h2>" + title + "</h2>" + @"
<table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                {0}
                </tbody>
            </table>", string.Join("", types.Select(table_row)));
        }
    }
}
