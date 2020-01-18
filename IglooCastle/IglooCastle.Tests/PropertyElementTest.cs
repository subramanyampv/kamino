using IglooCastle.Core;
using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using IglooCastle.Demo;
using NUnit.Framework;

namespace IglooCastle.Tests
{
    [TestFixture]
	public class PropertyElementTest : TestBase
	{
		[Test]
		public void TestHtml()
		{
			const string expected = "<a href=\"P_IglooCastle.Core.Elements.TypeElement.Methods.html\">Methods</a>";
			Assert.AreEqual(
				expected,
				Documentation.Find(typeof(TypeElement)).GetProperty("Methods").ToHtml());
		}

		[Test]
		public void TestSyntaxWithLinks()
		{
			const string expected = "public TMember Member { get; }";
			Assert.AreEqual(
				expected,
				Documentation.Find(typeof(DocumentationElement<>)).GetProperty("Member").ToSyntax());
		}

		[Test]
		public void TestSyntaxNullableProperty()
		{
			const string expected = "public <a href=\"http://msdn.microsoft.com/en-us/library/system.double%28v=vs.110%29.aspx\">double</a>? Price { get; set; }";
			Assert.AreEqual(
				expected,
				Documentation.Find(typeof(DemoStruct)).GetProperty("Price").ToSyntax());
		}
	}
}
