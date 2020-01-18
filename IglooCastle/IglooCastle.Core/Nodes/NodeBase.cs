using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents a node in the HTML hierarchy.
    /// </summary>
    public abstract class NodeBase
    {
        private string EXPANDER = "<span class=\"js-expander\">-</span>";
        private int _widget_member_filter_id = 0;

        /// <summary>
        /// Returns the HTML for the left side navigation tree.
        /// </summary>
        /// <returns></returns>
        public virtual string nav_html()
        {
            var children_html = children_nav_html();
            var node_html = Helpers.a(href(), text());
            if (!string.IsNullOrEmpty(children_html))
            {
                return string.Format(@"<li>{0} {1}
<ol>
{2}
</ol>
</li>", EXPANDER, node_html, children_html);
            }

            return string.Format(@"<li class=""leaf"">{0}</li>", node_html);
        }

        /// <summary>
        /// Returns the children nodes' HTML for the left side navigation.
        /// </summary>
        /// <returns></returns>
        public virtual string children_nav_html()
        {
            return children().Select(n => n.nav_html()).Aggregate("", (s1, s2) => s1 + "\n" + s2);
        }

        /// <summary>
        /// Returns the HTML template for the main content area.
        /// </summary>
        /// <returns></returns>
        public virtual HtmlTemplate contents_html_template()
        {
            return null;
        }

        /// <summary>
        /// Calls <paramref name="f"/> for every node in the tree.
        /// </summary>
        /// <param name="f"></param>
        public void visit(Action<NodeBase> f)
        {
            f(this);
            foreach (var child in children())
            {
                child.visit(f);
            }
        }

        /// <summary>
        /// Returns the file that this node should be written to.
        /// </summary>
        /// <returns></returns>
        public abstract string href();

        /// <summary>
        /// Returns the title of this node in the tree.
        /// </summary>
        /// <returns></returns>
        public abstract string text();

        /// <summary>
        /// Returns the child nodes of this node.
        /// </summary>
        /// <returns></returns>
        public virtual IEnumerable<NodeBase> children()
        {
            return Enumerable.Empty<NodeBase>();
        }

        /// <summary>
        /// Checks if this node is empty.
        /// Used in combination with filter_empty.
        /// </summary>
        /// <returns></returns>
        public virtual bool is_content_empty()
        {
            return false;
        }

        /// <summary>
        /// Renders an optional text indicating that the given element is inherited.
        /// </summary>
        public string inherited_from<T>(TypeMemberElement<T> memberElement)
            where T : MemberInfo
        {
            if (memberElement.IsInherited)
            {
                return string.Format("(Inherited from {0})", memberElement.DeclaringType.ToHtml());
            }

            return "";
        }

        private string access_css<T>(TypeMemberElement<T> element)
            where T : MemberInfo
        {
            return element.AccessAttributes.FormatAccess();
        }

        private string access_str<T>(TypeMemberElement<T> element)
            where T : MemberInfo
        {
            var access = element.AccessAttributes;
            var access_str = access.FormatAccess();
            access_str = string.Format(@"<span class=""{0}"" title=""{1}"">{2}</span>",
                access_str, access_str, access_str);

            MethodElement methodElement = element as MethodElement;
            if (methodElement != null && methodElement.IsStatic)
            {
                access_str += @"<span class=""static"" title=""static"">static</span>";
            }

            return access_str;
        }

        private string constructor_list_item(ConstructorElement constructor_element)
        {
            var description = string.Join(" ",
                constructor_element.XmlComment.Summary() ?? "&nbsp;",
                inherited_from(constructor_element));

            return string.Format(@"
<tr class=""{0}"">
    <td>{1}</td>
    <td>{2}</td>
    <td>{3}</td>
</tr>", tableRowClass(constructor_element), access_str(constructor_element), constructor_element.ToHtml(), description);
        }

        /// <summary>
        /// Renders a table for the given constructors.
        /// </summary>
        protected string constructors_table(IEnumerable<ConstructorElement> constructors)
        {
            return Helpers.fmt_non_empty(@"
<table class=""members constructors"">
               <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                {0}
                </tbody>
            </table>",
            string.Join("", constructors.Select(constructor_list_item)));
        }

        private string property_list_item(PropertyElement propertyElement)
        {
            var description = string.Join(" ",
                propertyElement.XmlComment.Summary() ?? "&nbsp;",
                inherited_from(propertyElement));

            return string.Format(@"
<tr class=""{0}"">
    <td>{1}</td>
    <td>{2}</td>
    <td>{3}</td>
    <td>{4}</td>
</tr>", tableRowClass(propertyElement), access_str(propertyElement),
propertyElement.ToHtml(),
propertyElement.PropertyType.ToHtml(),
description);
        }

        /// <summary>
        /// Renders a table for the given properties.
        /// </summary>
        protected string properties_table(IEnumerable<PropertyElement> properties)
        {
            return Helpers.fmt_non_empty(@"
<table class=""members properties"">
               <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                {0}
                </tbody>
            </table>",
            string.Join("", properties.Select(property_list_item)));
        }

        private string method_list_item(MethodElement methodElement)
        {
            var description = string.Join(" ",
                methodElement.XmlComment.Summary() ?? "&nbsp;",
                inherited_from(methodElement));

            return string.Format(@"
<tr class=""{0}"">
    <td>{1}</td>
    <td>{2}</td>
    <td>{3}</td>
</tr>", tableRowClass(methodElement), access_str(methodElement), methodElement.ToHtml(), description);
        }

        private string tableRowClass<T>(TypeMemberElement<T> element) where T : MemberInfo
        {
            bool isInherited = element.IsInherited;
            string css = access_css(element);
            return isInherited ? $"inherited {css}" : css;
        }

        /// <summary>
        /// Renders a table for the given methods.
        /// </summary>
        protected string methods_table(IEnumerable<MethodElement> methods)
        {
            return Helpers.fmt_non_empty(@"
<table class=""members methods"">
               <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                {0}
                </tbody>
            </table>",
            string.Join("", methods.Select(method_list_item)));
        }

        /// <summary>
        /// Renders the widget that filters members.
        /// </summary>
        protected string widgetMemberFilter(bool showInherited = true)
        {
            _widget_member_filter_id = _widget_member_filter_id + 1;
            var idInherited = "chkShowInherited" + _widget_member_filter_id;
            var idProtected = "chkShowProtected" + _widget_member_filter_id;
            var inheritedHtml = showInherited ? CheckboxWithLabel("js-show-inherited", idInherited, "Inherited") : "";
            var protectedHtml = CheckboxWithLabel("js-show-protected", idProtected, "Protected");

            return string.Format(@"<!-- begin widget member filter -->
<div>
    Show:
    {0}
    {1}
</div>
<!-- end widget member filter -->", inheritedHtml, protectedHtml);
        }

        private string CheckboxWithLabel(string cssClass, string id, string label)
        {
            return string.Format(@"<input type=""checkbox"" checked=""checked"" class=""{0}"" id=""{1}"" />
<label for=""{1}"">{2}</label>", cssClass, id, label);
        }
    }
}
