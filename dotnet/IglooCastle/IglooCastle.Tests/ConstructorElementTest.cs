using IglooCastle.Core;
using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using NUnit.Framework;

namespace IglooCastle.Tests
{
    [TestFixture]
    public class ConstructorElementTest : TestBase
    {
        [Test]
        public void Test_Filename()
        {
            ConstructorElement constructorElement = 
                Documentation.Find(typeof(Documentation))
                .GetConstructor();

            Assert.AreEqual("C_IglooCastle.Core.Documentation.html", constructorElement.Filename());
        }

        [Test]
        public void Test_Print()
        {
            ConstructorElement constructorElement = 
                Documentation.Find(typeof(Documentation))
                    .GetConstructor();

            Assert.AreEqual(
                "<a href=\"C_IglooCastle.Core.Documentation.html\">Documentation</a>",
                constructorElement.ToHtml());
        }

        [Test]
        public void Test_Syntax()
        {
            ConstructorElement constructorElement = 
                Documentation.Find(typeof(Documentation))
                    .GetConstructor();

            Assert.AreEqual(
                "public Documentation()",
                constructorElement.ToSyntax());
        }
    }
}
