using IglooCastle.Core.Elements;
using System;
using System.Linq;
using System.Runtime.CompilerServices;

namespace IglooCastle.Core.Printers
{
    class CustomAttributeDataPrinter : PrinterBase<CustomAttributeDataElement>
	{
		public CustomAttributeDataPrinter(Documentation documentation)
			: base(documentation)
		{
		}

		public override string Print(CustomAttributeDataElement element, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}

		public override string Syntax(CustomAttributeDataElement element, bool typeLinks = true)
		{
			if (IsSpecialAttribute(element))
			{
				return string.Empty;
			}

			string name = element.Member.AttributeType.Name;
			if (name.EndsWith("Attribute"))
			{
				name = name.Substring(0, name.Length - "Attribute".Length);
			}

			string link = typeLinks ? element.AttributeType.Link() : null;
			if (link != null)
			{
				name = string.Format("<a href=\"{0}\">{1}</a>", link, name);
			}

			var ci = element.Member.Constructor;
			var cargs = element.Member.ConstructorArguments;
			var nargs = element.Member.NamedArguments;

			if (cargs.Any() || nargs.Any())
			{
				name += "(";
				name += string.Join(", ",
					cargs.Select(c => FmtArg(c.Value))
					.Concat(
					nargs.Select(n => n.MemberName + " = " + FmtArg(n.TypedValue.Value)))
				);
				name += ")";
			}

			return "[" + name + "]";
		}

		public override string Signature(CustomAttributeDataElement element, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}


		private bool IsSpecialAttribute(CustomAttributeDataElement element)
		{
			return element.Member.AttributeType == typeof(ExtensionAttribute);
		}

		private object FmtArg(object value)
		{
			if (value is string)
			{
				return "\"" + value + "\"";
			}

			return value;
		}
	}
}
