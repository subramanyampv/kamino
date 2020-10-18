using IglooCastle.Core.Elements;
using System;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Printers
{
    internal sealed class TypePrinter : PrinterBase<TypeElement>
	{
		public TypePrinter(Documentation documentation) : base(documentation)
		{
		}

		public override string Print(TypeElement type, bool typeLinks = true)
		{
			if (type.IsArray)
			{
				return Print(type.GetElementType(), typeLinks) + "[]";
			}

			if (type.IsByRef)
			{
				return Print(type.GetElementType(), typeLinks);
			}

			if (type.IsNullable)
			{
				return Print(type.GetNullableType(), typeLinks) + "?";
			}

			string result;

			if (type.IsGenericType && !type.IsGenericParameter && !type.IsGenericTypeDefinition)
			{
				result = DoPrint(type.GetGenericTypeDefinition(), typeLinks);
			}
			else
			{
				result = DoPrint(type, typeLinks);
			}

			if (type.IsGenericType)
			{
				result += "&lt;";
				result += string.Join(", ", type.GetGenericArguments().Select(t => Print(t, typeLinks)));
				result += "&gt;";
			}

			return result;
		}

		private string DoPrint(TypeElement type, bool typeLinks)
		{
			string link = type.Link();
			string text = link != null ? ShortName(type) : FullName(type);
			if (link != null && typeLinks)
			{
				return string.Format("<a href=\"{0}\">{1}</a>", link.Escape(), text);
			}
			else
			{
				return text;
			}
		}

		private string FullName(TypeElement type)
		{
			if (type.IsGenericParameter)
			{
				return type.Name;
			}

			if (type.IsGenericType)
			{
				return type.Member.FullName.Split('`')[0];
			}

			return SystemTypes.Alias(type.Member) ?? type.Member.FullName ?? ShortName(type);
		}

		private string ShortName(TypeElement type)
		{
			if (type.IsNested && !type.IsGenericParameter)
			{
				TypeElement containerType = type.DeclaringType;
				return ShortName(containerType) + "." + type.Name;
			}

			if (type.IsGenericType)
			{
				return type.Name.Split('`')[0];
			}

			return SystemTypes.Alias(type.Member) ?? type.Name;
		}

		[Flags]
		public enum NameComponents
		{
			Name = 0,
			GenericArguments = 1,
			Namespace = 2
		}

		public string Name(TypeElement type, NameComponents nameComponents)
		{
			string name = ShortName(type);

			if (type.IsGenericType && ((nameComponents & NameComponents.GenericArguments) == NameComponents.GenericArguments))
			{
				name = name + "&lt;" + string.Join(", ", type.GetGenericArguments().Select(t => t.Name)) + "&gt;";
			}

			if ((nameComponents & NameComponents.Namespace) == NameComponents.Namespace)
			{
				name = type.Namespace + "." + name;
			}

			return name;
		}

		private string GenericArgumentSyntaxPrefix(TypeElement genericArgument)
		{
			var g = genericArgument.GenericParameterAttributes;
			if ((g & GenericParameterAttributes.Contravariant) == GenericParameterAttributes.Contravariant)
			{
				return "in";
			}

			if ((g & GenericParameterAttributes.Covariant) == GenericParameterAttributes.Covariant)
			{
				return "out";
			}

			return string.Empty;
		}

		private string GenericArgumentSyntax(TypeElement genericArgument)
		{
			return " ".JoinNonEmpty(GenericArgumentSyntaxPrefix(genericArgument), genericArgument.Name);
		}

		private string NameForSyntax(TypeElement type)
		{
			string name = ShortName(type);
			if (type.IsGenericType)
			{
				name += "&lt;"
					+ string.Join(", ", type.GetGenericArguments().Select(GenericArgumentSyntax))
					+ "&gt;";
			}

			return name;
		}

		private TypeElement BaseTypeForSyntax(TypeElement type)
		{
			if (type.IsValueType)
			{
				return null;
			}

			TypeElement baseType = type.BaseType;
			if (baseType != null && baseType.BaseType == null)
			{
				// every class derives from System.Object, that's not interesting
				return null;
			}

			return baseType;
		}

		public override string Syntax(TypeElement type, bool typeLinks = true)
		{
			string result = " ".JoinNonEmpty(
				SyntaxOfAttributes(type, typeLinks),
				"public",
				type.IsInterface || type.IsValueType ? "" :
				(type.IsStatic ? "static" : (type.IsSealed ? "sealed" : type.IsAbstract ? "abstract" : "")),
				type.IsClass ? "class" : type.IsEnum ? "enum" : type.IsInterface ? "interface" : "struct",
				NameForSyntax(type));

			TypeElement baseType = BaseTypeForSyntax(type);
			var interfaces = type.GetInterfaces();
			var baseTypes = new[] { baseType }.Concat(interfaces).Where(t => t != null).ToArray();
			if (baseTypes.Any())
			{
				result = result + " : " + string.Join(", ", baseTypes.Select(t => Print(t, typeLinks)));
			}

			return result;
		}

		public override string Signature(TypeElement element, bool typeLinks = true)
		{
			throw new NotImplementedException();
		}

		public override string Format(TypeElement element, string format)
		{
			if (format != "n" && format != "s" && format != "f")
			{
				return base.Format(element, format);
			}

			TypePrinter.NameComponents nameComponents = TypePrinter.NameComponents.Name;

			if (format != "n")
			{
				nameComponents |= TypePrinter.NameComponents.GenericArguments;
			}

			if (format == "f")
			{
				nameComponents = nameComponents | TypePrinter.NameComponents.Namespace;
			}

			return Name(element, nameComponents);
		}
	}
}
