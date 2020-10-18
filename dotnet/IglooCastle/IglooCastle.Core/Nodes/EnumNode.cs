using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Renders information about an enum.
    /// </summary>
    public class EnumNode : NodeBase
    {
        private TypeElement typeElement;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public EnumNode(TypeElement typeElement)
        {
            this.typeElement = typeElement;
        }

        /// <summary>
        /// Gets the href of this node.
        /// </summary>
        public override string href()
        {
            return typeElement.Filename();
        }

        /// <summary>
        /// Gets the text of this node.
        /// </summary>
        public override string text()
        {
            return typeElement.ToString("s") + " " + typeElement.TypeKind;
        }

        /// <summary>
        /// Renders the html template.
        /// </summary>
        public override HtmlTemplate contents_html_template()
        {
            var typeKind = typeElement.TypeKind;
            var hasFlags = typeElement.HasAttribute("System.FlagsAttribute");
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", typeElement.ToString("f"), typeKind),
                h1 = string.Format("{0} {1}", typeElement.ToString("s"), typeKind),
                main = Helpers.fmt_non_empty("<h2>Summary</h2><p>{0}</p>", typeElement.XmlComment.Summary())
            };

            if (hasFlags)
            {
                htmlTemplate.main += @"
<p class=""info"">This is a flags enum;
its members can be combined with bitwise operators.</p>";
            }

            htmlTemplate.main += _members_section();
            return htmlTemplate;
        }

        private string _members_section()
        {
            var html = typeElement.EnumMembers.Select(fmt_enum_member);
            return string.Format(@"
<h2>Members</h2>
<table class=""enum_members"">
    <thead>
        <tr>
            <th>Name</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        {0}
    </tbody>
</table>", string.Join("", html));
        }

        private string fmt_enum_member(EnumMemberElement enumMember)
        {
            return string.Format(@"
<tr>
    <td>{0}</td>
    <td>{1}</td>
    <td>{2}</td>
</tr>", enumMember.Name, enumMember.Value, enumMember.XmlComment.Summary() ?? "&nbsp;");
        }
    }
}
