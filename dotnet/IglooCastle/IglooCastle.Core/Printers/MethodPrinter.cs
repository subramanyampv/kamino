using IglooCastle.Core.Elements;
using System.Reflection;

namespace IglooCastle.Core.Printers
{
    class MethodPrinter : MethodBasePrinter<MethodElement, MethodInfo>
	{
		public MethodPrinter(Documentation documentation) : base(documentation) { }

		public override string Print(MethodElement methodInfo, bool typeLinks = true)
		{
			string text = Signature(methodInfo);
			string link = methodInfo.Link();
			if (link == null)
			{
				return text;
			}

			return string.Format("<a href=\"{0}\">{1}</a>", link.Escape(), text);
		}

		public override string Signature(MethodElement methodElement, bool typeLinks = true)
		{
			string text;
			if (methodElement.IsOverload)
			{
				text = methodElement.Name + ParameterSignature(methodElement);
			}
			else
			{
				text = methodElement.Name;
			}

			return text;
		}

		public override string Syntax(MethodElement method, bool typeLinks = true)
		{
			string access = AccessPrefix(method);
			string modifiers = Modifiers(method);
			string returnType = method.ReturnType.ToHtml(typeLinks);
			string args = Parameters(method, typeLinks);
			return " ".JoinNonEmpty(
				SyntaxOfAttributes(method, typeLinks),
				access,
				modifiers,
				returnType,
				method.Name) + "(" + args + ")";
		}
	}
}
