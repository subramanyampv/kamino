using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Renders information for a method.
    /// </summary>
    public class MethodNode : NodeBase
    {
        private MethodElement methodElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public MethodNode(MethodElement methodElement)
        {
            this.methodElement = methodElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return methodElement.Filename();
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return methodElement.ToSignature();
        }

        /// <summary>
        /// Renders the contents.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var methodName = methodElement.Name;
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", methodName, "Method"),
                h1 = string.Format("{0}.{1} {2}", methodElement.OwnerType.ToString("s"), methodName, "Method"),
                main = string.Join("\n",
                    summarySection(),
                    syntaxSection(),
                    exceptionsSection(),
                    remarksSection(),
                    exampleSection(),
                    seeAlsoSection())
            };

            return htmlTemplate;
        }

        private string summarySection()
        {
            return string.Format(@"
<p>{0}</p>
<dl>
    <dt>Namespace</dt>
    <dd>{1}</dd>
    <dt>Assembly</dt>
    <dd>{2}</dd>
</dl>
", methodElement.XmlComment.Summary(),
methodElement.NamespaceElement.ToHtml(),
methodElement.OwnerType.Assembly.ToString());
        }

        private string syntaxSection()
        {
            return string.Format(@"
<h2>Syntax</h2>
<code class=""syntax"">
{0}
</code>{1}{2}", methodElement.ToSyntax(), _parametersSection(), _returnValue());
        }

        private string _parameter(ParameterInfoElement parameter)
        {
            return string.Format("<li>{0}<br />Type: {1} {2}</li>", parameter.Name, parameter.ParameterType.ToHtml(), methodElement.XmlComment.Param(parameter.Name));
        }

        private string _parametersSection()
        {
            return Helpers.fmt_non_empty(@"
<h3>Parameters</h3>
<ol>
{0}
</ol>
", methodElement.GetParameters().Select(_parameter));
        }

        private string _returnValue()
        {
            return string.Format(@"
<h3>Return Value</h3>
<p>Type: {0}</p>
<p>{1}</p>", methodElement.ReturnType.ToHtml(),
methodElement.XmlComment.Section("returns"));
        }

        private string exceptionsSection()
        {
            return string.Empty;
        }

        private string remarksSection()
        {
            return methodElement.XmlComment.Section("remarks");
        }

        private string exampleSection()
        {
            return methodElement.XmlComment.Section("example");
        }

        private string seeAlsoSection()
        {
            return "";
        }
    }
}
