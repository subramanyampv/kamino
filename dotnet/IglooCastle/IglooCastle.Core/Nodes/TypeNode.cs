using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    class TypeNode : NodeBase
    {
        private TypeElement typeElement;
        public TypeNode(TypeElement typeElement)
        {
            this.typeElement = typeElement;
        }

        public override string href()
        {
            return typeElement.Filename();
        }

        public override string text()
        {
            return typeElement.ToString("s") + " " + typeElement.TypeKind;
        }

        public override IEnumerable<NodeBase> children()
        {
            return new NodeBase[]
            {
                Simplify(new ConstructorsNode(typeElement)),
                new PropertiesNode(typeElement),
                new MethodsNode(typeElement)
            }.filter_empty();

            // TODO eventsNode
        }

        /// <summary>
        /// Flattens a constructors node into a constructor node if needed.
        /// </summary>
        private static NodeBase Simplify(ConstructorsNode constructorsNode)
        {
            var children = constructorsNode.children();
            if (children.Count() == 1)
            {
                return children.Single();
            }

            return constructorsNode;
        }

        public override HtmlTemplate contents_html_template()
        {
            var type_kind = typeElement.TypeKind;
            var htmlTemplate = new HtmlTemplate
            {
                title = string.Format("{0} {1}", typeElement.ToString("f"), type_kind),
                h1 = string.Format("{0} {1}", typeElement.ToString("s"), type_kind),
                main = string.Join("\n",
                    Helpers.fmt_non_empty(@"
<h2>Summary</h2>
<p>{0}</p>
", typeElement.XmlComment.Summary()
                ),
                    _base_type_section(),
                    _interfaces_section(),
                    _derived_types_section(),
                    _syntax_section(),
                    _constructors_section(),
                    _properties_section(),
                    _methods_section(),
                    _extension_methods_section()
                )
            };

            // TODO operators
            // TODO separate attribute template?
            return htmlTemplate;
        }

        public Documentation Documentation
        {
            get
            {
                return typeElement.Documentation;
            }
        }

        private string _base_type_section()
        {
            var baseType = typeElement.BaseType;

            // check if we're documenting System.Object or a class deriving direction from Object
            if (baseType == null || baseType.BaseType == null)
            {
                return string.Empty;
            }

            return string.Format("<p>Inherits from {0}</p>", baseType.ToHtml());
        }

        private string _interfaces_section()
        {
            var interfaces = typeElement.GetInterfaces();
            if (interfaces == null || interfaces.Length <= 0)
            {
                return string.Empty;
            }

            return string.Format("<p>Implements interfaces: {0}</p>", string.Join(", ", interfaces.Select(t => t.ToHtml())));
        }

        private string _derived_types_section()
        {
            var interfaces = typeElement.GetDescendantTypes();
            if (interfaces == null || interfaces.Count <= 0)
            {
                return string.Empty;
            }

            return string.Format("<p>Known derived types: {0}</p>", string.Join(", ", interfaces.Select(t => t.ToHtml())));
        }

        private string _syntax_section()
        {
            return string.Join("\n",
                string.Format("<h2>Syntax</h2><code class=\"syntax\">{0}</code>", typeElement.ToSyntax()),
                Helpers.fmt_non_empty("<h3>Type parameters</h3>{0}", _syntax_type_parameters()));
        }

        private string _syntax_type_parameters()
        {
            if (!typeElement.IsGenericType || !typeElement.IsGenericTypeDefinition)
            {
                return string.Empty;
            }

            var result = "<dl>";
            foreach (var t in typeElement.GetGenericArguments())
            {
                result += "<dt>";
                result += t.Name;
                result += "</dt>";
                result += "<dd>";
                result += "<p>" + (typeElement.XmlComment.TypeParam(t.Name) ?? "&nbsp;") + "</p>";
                result += "<p>" + _generic_argument_constraints(t) + "</p>";
                result += "</dd>";
            }

            result += "</dl>";
            return result;
        }

        private string _generic_argument_constraints(TypeElement t)
        {
            var result = new List<string>();
            var ga = t.GenericParameterAttributes;
            if ((ga & System.Reflection.GenericParameterAttributes.NotNullableValueTypeConstraint) == System.Reflection.GenericParameterAttributes.NotNullableValueTypeConstraint)
            {
                result.Add("struct");
            }
            else if ((ga & System.Reflection.GenericParameterAttributes.ReferenceTypeConstraint) == System.Reflection.GenericParameterAttributes.ReferenceTypeConstraint)
            {
                result.Add("class");
            }

            foreach (var constraint in t.GetGenericParameterConstraints())
            {
                if (constraint.Member != typeof(ValueType))
                {
                    result.Add(t.Name + " is " + constraint.ToHtml());
                }
            }

            if (((ga & System.Reflection.GenericParameterAttributes.DefaultConstructorConstraint) == System.Reflection.GenericParameterAttributes.DefaultConstructorConstraint)
                && ((ga & System.Reflection.GenericParameterAttributes.NotNullableValueTypeConstraint) != System.Reflection.GenericParameterAttributes.NotNullableValueTypeConstraint))
            {
                result.Add("new()");
            }

            return string.Join(", ", result);
        }

        private string _constructors_section()
        {
            return Helpers.fmt_non_empty(
                "<h2>Constructors</h2>" + widgetMemberFilter(showInherited: false) + "{0}",
                constructors_table(typeElement.Constructors));
        }

        private string _properties_section()
        {
            return Helpers.fmt_non_empty(
                "<h2>Properties</h2>" + widgetMemberFilter() + "{0}",
                properties_table(typeElement.Properties));
        }

        private string _methods_section()
        {
            return Helpers.fmt_non_empty(
                "<h2>Methods</h2>" + widgetMemberFilter() + "{0}",
                methods_table(typeElement.Methods));
        }

        private string _extension_methods_section()
        {
            return Helpers.fmt_non_empty(
                "<h2>Extension Methods</h2>{0}",
                methods_table(typeElement.ExtensionMethods));
        }


    }
}
