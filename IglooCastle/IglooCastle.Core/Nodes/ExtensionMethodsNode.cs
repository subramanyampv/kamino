using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Renders information about extension methods in a namespace.
    /// </summary>
    public class ExtensionMethodsNode : NodeBase
    {
        private NamespaceElement namespaceElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public ExtensionMethodsNode(NamespaceElement namespaceElement)
        {
            this.namespaceElement = namespaceElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return namespaceElement.Filename(prefix: "ExtensionMethods");
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return "Extension Methods";
        }

        /// <summary>
        /// Checks if this node is empty.
        /// </summary>
        public override bool is_content_empty()
        {
            return !_get_extension_methods().Any();
        }

        /// <summary>
        /// Renders the HTML template.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", namespaceElement.Namespace, text()),
                main = ""
            };

            var extensionMethods = _get_extension_methods();
            var methodsByExtendedType = new Dictionary<TypeElement, List<MethodElement>>();
            foreach (var m in extensionMethods)
            {
                TypeElement extendedType = m.GetParameters()[0].ParameterType;
                List<MethodElement> lst;
                if (!methodsByExtendedType.TryGetValue(extendedType, out lst))
                {
                    lst = new List<MethodElement>();
                    methodsByExtendedType[extendedType] = lst;
                }

                lst.Add(m);
            }

            foreach (TypeElement extendedType in methodsByExtendedType.Keys)
            {
                htmlTemplate.main += string.Format("<h2>Extension methods for {0}</h2>", extendedType.ToHtml());
                htmlTemplate.main += methods_table(methodsByExtendedType[extendedType]);
            }

            return htmlTemplate;
        }

        private IEnumerable<MethodElement> _get_extension_methods()
        {
            return namespaceElement.Methods.Where(m => !m.IsInherited && m.IsExtension());
        }
    }
}
