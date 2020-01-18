using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Renders a constructor node.
    /// </summary>
    public class ConstructorNode : NodeBase
    {
        private ConstructorElement constructorElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public ConstructorNode(ConstructorElement constructorElement)
        {
            if (constructorElement == null)
            {
                throw new ArgumentNullException();
            }

            this.constructorElement = constructorElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return constructorElement.Filename();
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return constructorElement.ToSignature() + " Constructor";
        }

        /// <summary>
        /// Renders the HTML template.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", constructorElement.OwnerType.ToString("f"), "Constructor"),
                h1 = string.Format("{0} {1}", constructorElement.OwnerType.ToString("s"), "Constructor"),
                main = string.Join("\n",
                    summarySection(),
                    syntax_section(),
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
</dl>",
    constructorElement.XmlComment.Summary(),
    constructorElement.NamespaceElement.ToHtml(),
    constructorElement.OwnerType.Assembly.ToString());
        }

        private string syntax_section()
        {
            var syntax = constructorElement.ToSyntax();
            return string.Format(@"
<h2>Syntax</h2>
<code class=""syntax"">
{0}
</code>
{1}", syntax, parametersSection());
        }

        private string _parameter(ParameterInfoElement parameter)
        {
            return string.Format("<li>{0}<br />Type: {1} {2}</li>",
                parameter.Name,
                parameter.ParameterType.ToHtml(),
                constructorElement.XmlComment.Param(parameter.Name));
        }

        private string parametersSection()
        {
            return Helpers.fmt_non_empty(@"
<h3>Parameters</h3>
<ol>
{0}
</ol>
", constructorElement.GetParameters().Select(_parameter));
        }

        private string exceptionsSection()
        {
            return string.Empty;
        }

        private string remarksSection()
        {
            return constructorElement.XmlComment.Section("remarks");
        }

        private string exampleSection()
        {
            return constructorElement.XmlComment.Section("example");
        }

        private string seeAlsoSection()
        {
            return "";
        }
    }
}
