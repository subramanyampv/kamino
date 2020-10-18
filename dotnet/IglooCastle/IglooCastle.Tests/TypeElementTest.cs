using IglooCastle.Core;
using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using IglooCastle.Demo;
using IglooCastle.Samples;
using NUnit.Framework;
using System;

namespace IglooCastle.Tests
{
    [TestFixture]
    public class TypeElementTest : TestBase
    {
        [Test]
        public void TestName()
        {
            var typeElement = Documentation.Find(typeof(TypeElement));
            Assert.IsNotNull(typeElement);
            Assert.AreEqual("TypeElement", typeElement.Name);
        }

        [Test]
        public void TestNameOfGenericDefinition()
        {
            var typeElement = Documentation.Find(typeof(DocumentationElement<>));
            Assert.AreEqual("DocumentationElement`1", typeElement.Name);
        }

        [Test]
        public void TestShortNameGenericDefinition()
        {
            var typeElement = Documentation.Find(typeof(DocumentationElement<>));
            Assert.AreEqual("DocumentationElement&lt;TMember&gt;", typeElement.ToString("s"));
        }

        [Test]
        public void TestFullNameGenericDefinition()
        {
            var typeElement = Documentation.Find(typeof(DocumentationElement<>));
            Assert.AreEqual("IglooCastle.Core.Elements.DocumentationElement&lt;TMember&gt;", typeElement.ToString("f"));
        }

        [Test]
        public void TestShortNameNestedClass()
        {
            var typeElement = Documentation.Find(typeof(Sample.NestedSample));
            Assert.AreEqual("Sample.NestedSample", typeElement.ToString("s"));
        }

        [Test]
        public void TestShortNameSecondLevelNestedClass()
        {
            var typeElement = Documentation.Find(typeof(Sample.NestedSample.SecondLevelNest));
            Assert.AreEqual("Sample.NestedSample.SecondLevelNest", typeElement.ToString("s"));
        }

        [Test]
        public void TestFullNameSecondLevelNestedClass()
        {
            var typeElement = Documentation.Find(typeof(Sample.NestedSample.SecondLevelNest));
            Assert.AreEqual(
                "IglooCastle.Samples.Sample.NestedSample.SecondLevelNest",
                typeElement.ToString("f"));
        }

        [Test]
        public void TestHtmlSystemString()
        {
            const string expected = "<a href=\"http://msdn.microsoft.com/en-us/library/system.string%28v=vs.110%29.aspx\">string</a>";
            Assert.AreEqual(expected, Documentation.Find(typeof(string)).ToHtml());
        }

        [Test]
        public void TestHtmlSystemType()
        {
            const string expected = "<a href=\"http://msdn.microsoft.com/en-us/library/system.type%28v=vs.110%29.aspx\">Type</a>";
            Assert.AreEqual(expected, Documentation.Find(typeof(Type)).ToHtml());
        }

        [Test]
        public void TestHtmlSystemObjectByRef()
        {
            const string expected = "<a href=\"http://msdn.microsoft.com/en-us/library/system.object%28v=vs.110%29.aspx\">object</a>";
            Assert.AreEqual(expected, Documentation.Find(typeof(object).MakeByRefType()).ToHtml());
        }

        [Test]
        public void TestHtml_GenericContainerIsNotLocalType_GenericArgumentIsLocalType()
        {
            // public ICollection<PropertyElement> Properties
            const string expected =
                "System.Collections.Generic.ICollection&lt;" +
                "<a href=\"T_IglooCastle.Core.Elements.PropertyElement.html\">PropertyElement</a>" +
                "&gt;";
            TypeElement targetTypeElement = Documentation.Find(typeof(TypeElement));
            PropertyElement targetProperty = targetTypeElement.GetProperty("Properties");
            Assert.AreEqual(expected, targetProperty.PropertyType.ToHtml());
        }

        [Test]
        public void TestHtmlArray()
        {
            const string expected = "<a href=\"T_IglooCastle.Core.Elements.NamespaceElement.html\">NamespaceElement</a>[]";
            Assert.AreEqual(expected, Documentation.Find(typeof(NamespaceElement[])).ToHtml());
        }

        [Test]
        public void TestHtmlGenericArgument()
        {
            const string expected = "TMember";
            TypeElement targetTypeElement = Documentation.Find(typeof(DocumentationElement<>));
            PropertyElement targetProperty = targetTypeElement.GetProperty("Member");
            Assert.AreEqual(expected, targetProperty.PropertyType.ToHtml());
        }

        [Test]
        public void TestHtmlNestedClass()
        {
            const string expected = "<a href=\"T_IglooCastle.Demo.NestingDemo+NestedDemo.html\">NestingDemo.NestedDemo</a>";
            Assert.AreEqual(expected, Documentation.Find(typeof(NestingDemo.NestedDemo)).ToHtml());
        }

        [Test]
        public void TestHtmlGenericTypeDefinition()
        {
            const string expected = "<a href=\"T_IglooCastle.Core.Elements.MethodBaseElement%601.html\">MethodBaseElement</a>&lt;T&gt;";
            Assert.AreEqual(expected, Documentation.Find(typeof(MethodBaseElement<>)).ToHtml());
        }

        [Test]
        public void TestHtmlCompleteGenericType()
        {
            const string expected = "<a href=\"T_IglooCastle.Core.Elements.DocumentationElement%601.html\">DocumentationElement</a>&lt;" +
                "<a href=\"T_IglooCastle.Core.Elements.PropertyElement.html\">PropertyElement</a>" +
                "&gt;";
            Assert.AreEqual(expected, Documentation.Find(typeof(DocumentationElement<PropertyElement>)).ToHtml());
        }

        [Test]
        public void TestSyntaxWithLinksClass()
        {
            const string expected = "public class Documentation : <a href=\"T_IglooCastle.Core.Elements.ITypeContainer.html\">ITypeContainer</a>";
            Assert.AreEqual(expected, Documentation.Find(typeof(Documentation)).ToSyntax());
        }

        [Test]
        public void TestSyntaxWithLinksInterface()
        {
            const string expected = "public interface ITypeContainer";
            Assert.AreEqual(expected, Documentation.Find(typeof(ITypeContainer)).ToSyntax());
        }

        [Test]
        public void TestSyntaxWithLinksStaticClass()
        {
            const string expected = "public static class XmlCommentExtensions";
            Assert.AreEqual(expected, Documentation.Find(typeof(XmlCommentExtensions)).ToSyntax());
        }

        [Test]
        public void TestSyntaxWithLinksSealedClass()
        {
            const string expected = "public sealed class FilenameProvider";
            Assert.AreEqual(expected, Documentation.Find(typeof(FilenameProvider)).ToSyntax());
        }

        [Test]
        public void TestSyntaxWithLinksAbstractClass()
        {
            string actual = Documentation.Find(typeof(DocumentationElement<>)).ToSyntax();
            StringAssert.Contains("public abstract class DocumentationElement&lt;TMember&gt; : <a", actual);
            StringAssert.Contains("<a href=\"T_IglooCastle.Core.Elements.IDocumentationElement.html\">IDocumentationElement</a>", actual);
        }

        [Test]
        public void TestSyntaxWithLinksDerivedClass()
        {
            string actual = Documentation.Find(typeof(TypeElement)).ToSyntax();
            StringAssert.Contains("public class TypeElement : <a", actual);
            StringAssert.Contains("<a href=\"T_IglooCastle.Core.Elements.ReflectedElement%601.html\">ReflectedElement</a>&lt;<a href=\"http://msdn.microsoft.com/en-us/library/system.type%28v=vs.110%29.aspx\">Type</a>&gt;", actual);
            StringAssert.Contains("<a href=\"T_IglooCastle.Core.Elements.IDocumentationElement.html\">IDocumentationElement</a>", actual);
        }

        [Test]
        public void TestSyntaxCovariance()
        {
            const string expected = "public interface IVariance&lt;in T1, out T2&gt;";
            Assert.AreEqual(expected, Documentation.Find(typeof(IVariance<,>)).ToSyntax());
        }

        [Test]
        public void TestSyntaxWithLinksAnnotatedDemo()
        {
            const string expected = "[<a href=\"T_IglooCastle.Demo.DemoAttribute.html\">Demo</a>] public class AnnotatedDemo";
            Assert.AreEqual(expected, Documentation.Find(typeof(AnnotatedDemo)).ToSyntax());
        }

        [Test]
        public void TestGetDescendantTypes()
        {
            var typeElement = Documentation.Find(typeof(DocumentationElement<>));
            var result = typeElement.GetDescendantTypes();
            Assert.IsNotNull(result);
            CollectionAssert.AreEquivalent(new TypeElement[]
            {
                Documentation.Find(typeof(AttributeElement)),
                Documentation.Find(typeof(ConstructorElement)),
                Documentation.Find(typeof(CustomAttributeDataElement)),
                Documentation.Find(typeof(EnumMemberElement)),
                Documentation.Find(typeof(MethodBaseElement<>)),
                Documentation.Find(typeof(MethodElement)),
                Documentation.Find(typeof(NamespaceElement)),
                Documentation.Find(typeof(ParameterInfoElement)),
                Documentation.Find(typeof(PropertyElement)),
                Documentation.Find(typeof(ReflectedElement<>)),
                Documentation.Find(typeof(TypeElement)),
                Documentation.Find(typeof(TypeMemberElement<>)),
            },
                result);
        }

        [Test]
        public void TestGetChildTypes()
        {
            var typeElement = Documentation.Find(typeof(DocumentationElement<>));
            var result = typeElement.GetChildTypes();
            Assert.IsNotNull(result);
            CollectionAssert.AreEquivalent(new TypeElement[]
            {
                Documentation.Find(typeof(AttributeElement)),
                Documentation.Find(typeof(CustomAttributeDataElement)),
                Documentation.Find(typeof(NamespaceElement)),
                Documentation.Find(typeof(ParameterInfoElement)),
                Documentation.Find(typeof(ReflectedElement<>)),
            },
                result);
        }

        [Test]
        public void TestSyntaxOfStruct()
        {
            var typeElement = Documentation.Find(typeof(DemoStruct));
            Assert.AreEqual("public struct DemoStruct", typeElement.ToSyntax());
        }
    }
}
