using IglooCastle.Core.Elements;

namespace IglooCastle.Core.Printers
{
    /// <summary>
    /// Extension methods for easier printing of elements.
    /// </summary>
    public static class PrintExtensions
    {
        /// <summary>
        /// Prints the given type element.
        /// </summary>
        public static string ToString(this TypeElement typeElement, string format)
        {
            return new TypePrinter(typeElement.Documentation).Format(typeElement, format);
        }

        /// <summary>
        /// Prints the given type element.
        /// </summary>
        public static string ToHtml(this TypeElement typeElement, bool typeLinks = true)
        {
            return new TypePrinter(typeElement.Documentation).Print(typeElement);
        }

        /// <summary>
        /// Prints the syntax of the given type element.
        /// </summary>
        public static string ToSyntax(this TypeElement typeElement)
        {
            return new TypePrinter(typeElement.Documentation).Syntax(typeElement);
        }

        /// <summary>
        /// Prints the HTML of the given method element.
        /// </summary>
        public static string ToHtml(this MethodElement methodElement)
        {
            return new MethodPrinter(methodElement.Documentation).Print(methodElement);
        }

        /// <summary>
        /// Prints the syntax of the given method element.
        /// </summary>
        public static string ToSyntax(this MethodElement methodElement)
        {
            return new MethodPrinter(methodElement.Documentation).Syntax(methodElement);
        }

        /// <summary>
        /// Prints the signature of the given method element.
        /// </summary>
        public static string ToSignature(this MethodElement methodElement)
        {
            return new MethodPrinter(methodElement.Documentation).Signature(methodElement);
        }

        /// <summary>
        /// Prints the syntax of the given property element.
        /// </summary>
        public static string ToSyntax(this PropertyElement propertyElement)
        {
            return new PropertyPrinter(propertyElement.Documentation).Syntax(propertyElement);
        }

        /// <summary>
        /// Prints the syntax of the given property element.
        /// </summary>
        public static string ToHtml(this PropertyElement propertyElement)
        {
            return new PropertyPrinter(propertyElement.Documentation).Print(propertyElement);
        }

        /// <summary>
        /// Prints the HTML of the given constructor element.
        /// </summary>
        public static string ToHtml(this ConstructorElement constructorElement)
        {
            return new ConstructorPrinter(constructorElement.Documentation).Print(constructorElement);
        }

        /// <summary>
        /// Prints the syntax of the given constructor element.
        /// </summary>
        public static string ToSyntax(this ConstructorElement constructorElement)
        {
            return new ConstructorPrinter(constructorElement.Documentation).Syntax(constructorElement);
        }

        /// <summary>
        /// Prints the signature of the given constructor element.
        /// </summary>
        public static string ToSignature(this ConstructorElement constructorElement)
        {
            return new ConstructorPrinter(constructorElement.Documentation).Signature(constructorElement);
        }

        /// <summary>
        /// Prints the syntax of the given custom attribute data element.
        /// </summary>
        public static string ToSyntax(this CustomAttributeDataElement customAttributeDataElement, bool useTypeLinks = true)
        {
            return new CustomAttributeDataPrinter(customAttributeDataElement.Documentation).Syntax(customAttributeDataElement, useTypeLinks);
        }

        /// <summary>
        /// Prints the HTML of the given namespace element.
        /// </summary>
        /// <param name="namespaceElement"></param>
        /// <returns></returns>
        public static string ToHtml(this NamespaceElement namespaceElement)
        {
            return new NamespacePrinter(namespaceElement.Documentation).Print(namespaceElement);
        }
    }
}
