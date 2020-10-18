using IglooCastle.Core;
using IglooCastle.Core.Elements;
using IglooCastle.Demo;
using NUnit.Framework;
using System.Linq;

namespace IglooCastle.Tests
{
    [TestFixture]
	public class XmlCommentTest : TestBase
	{
		[Test]
		public void TestParam()
		{
			var xmlComment = Documentation.Find(typeof(CalculatorDemo))
				.GetMethod("Add").XmlComment;
			Assert.IsNotNull(xmlComment);
			Assert.IsNotInstanceOf(typeof(MissingXmlComment), xmlComment);
			Assert.AreEqual("Adds two numbers.", xmlComment.Summary());
			Assert.AreEqual("The first number to add.", xmlComment.Param("x"));
			Assert.AreEqual("The second number to add.", xmlComment.Param("y"));
			Assert.AreEqual("The sum of the two parameters.", xmlComment.Returns());
		}
	}
}
