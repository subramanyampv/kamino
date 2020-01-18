using IglooCastle.Core.Elements;
using System;
using System.Reflection;

namespace IglooCastle.Core.Printers
{
    class PropertyPrinter : PrinterBase<PropertyElement>
	{
		public PropertyPrinter(Documentation documentation) : base(documentation) { }

		public override string Print(PropertyElement property, bool typeLinks = true)
		{
			string link = property.Link();
			if (link == null)
			{
				return property.Name;
			}

			return string.Format("<a href=\"{0}\">{1}</a>", link.Escape(), property.Name);
		}

		public override string Signature(PropertyElement property, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}

		public override string Syntax(PropertyElement property, bool typeLinks = true)
		{
			var getter = property.CanRead ? property.GetMethod : null;
			var setter = property.CanWrite ? property.SetMethod : null;

			var getterAccess = getter != null ? getter.AccessAttributes : MethodAttributes.PrivateScope;
			var setterAccess = setter != null ? setter.AccessAttributes : MethodAttributes.PrivateScope;
			var maxAccess = property.AccessAttributes;

			return " ".JoinNonEmpty(
				SyntaxOfAttributes(property, typeLinks),
				maxAccess.FormatAccess(),
				property.PropertyType.ToHtml(typeLinks),
				property.Name,
				"{",
				getter != null && !getter.IsPrivate ? ((getterAccess != maxAccess) ? getterAccess.FormatAccess() + " " : "") + "get;" : "",
				setter != null && !setter.IsPrivate ? ((setterAccess != maxAccess) ? setterAccess.FormatAccess() + " " : "") + "set;" : "",
				"}");
		}
	}
}
