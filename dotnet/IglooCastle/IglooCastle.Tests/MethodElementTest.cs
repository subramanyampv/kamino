using IglooCastle.Core;
using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using IglooCastle.Samples;
using NUnit.Framework;
using System;

namespace IglooCastle.Tests
{
    [TestFixture]
	public class MethodElementTest : TestBase
	{
		[Test]
		public void TestHtmlSystemObjectParameter()
		{
			const string expected = "Equals(object)";
			var method = Documentation.Find(typeof(Sample))
				.GetMethod("Equals", new[] { typeof(object) });
			Assert.AreEqual(expected, method.ToHtml());
		}

		[Test]
		public void TestHtmlExtensionMethod()
		{
			const string expected = "<a href=\"M_IglooCastle.Core.XmlCommentExtensions.Summary-IglooCastle.Core.IXmlComment.html\">Summary</a>";
			var method = Documentation.Find(typeof(XmlCommentExtensions)).GetMethod("Summary");
			Assert.AreEqual(expected, method.ToHtml());
		}

		[Test]
		public void TestHtmlEquals()
		{
			const string expected = "Equals";
			var method = Documentation.Find(typeof(XmlComment)).GetMethod("Equals");
			Assert.IsNotNull(method);
			Assert.AreEqual(expected, method.ToHtml());
		}

		[Test]
		public void TestSyntaxWithLinks()
		{
			const string expected = "public <a href=\"http://msdn.microsoft.com/en-us/library/system.void%28v=vs.110%29.aspx\">void</a> Scan(<a href=\"http://msdn.microsoft.com/en-us/library/system.reflection.assembly%28v=vs.110%29.aspx\">Assembly</a> assembly)";
			var method = Documentation.Find(typeof(Documentation)).GetMethod("Scan");
			Assert.AreEqual(expected, method.ToSyntax());
		}

		[Test]
		public void TestSyntaxWithLinksProtectedMethod()
		{
			const string expected = "protected abstract <a href=\"T_IglooCastle.Core.IXmlComment.html\">IXmlComment</a> GetXmlComment()";
			var method = Documentation.Find(typeof(ReflectedElement<>))
				.GetMethod("GetXmlComment");
			Assert.AreEqual(expected, method.ToSyntax());
		}

		[Test]
		public void TestSyntaxWithLinksInterfaceMethod()
		{
			const string expected = "<a href=\"http://msdn.microsoft.com/en-us/library/system.string%28v=vs.110%29.aspx\">string</a> Section(<a href=\"http://msdn.microsoft.com/en-us/library/system.string%28v=vs.110%29.aspx\">string</a> sectionName)";
			var method = Documentation.Find(typeof(IXmlComment))
				.GetMethod("Section", new[] { typeof(string) });
			Assert.AreEqual(expected, method.ToSyntax());
		}

		[Test]
		public void TestSyntaxWithLinksProtectedOverride()
		{
			const string expected = "protected override <a href=\"T_IglooCastle.Core.IXmlComment.html\">IXmlComment</a> GetXmlComment()";
			var method = Documentation.Find(typeof(PropertyElement))
				.GetMethod("GetXmlComment");
			Assert.AreEqual(expected, method.ToSyntax());
		}

		[Test]
		public void TestSyntaxWithLinksExtensionMethod()
		{
			const string expected = "public static <a href=\"http://msdn.microsoft.com/en-us/library/system.string%28v=vs.110%29.aspx\">string</a> Summary(this <a href=\"T_IglooCastle.Core.IXmlComment.html\">IXmlComment</a> xmlComment)";
			var method = Documentation.Find(typeof(XmlCommentExtensions))
				.GetMethod("Summary");
			Assert.AreEqual(expected, method.ToSyntax());
		}
	}
}
