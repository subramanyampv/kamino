using IglooCastle.Core;
using NUnit.Framework;

namespace IglooCastle.Tests
{
    [TestFixture]
    class PageModelTest
    {
        [Test]
        public void TestToString()
        {
            PageModel pageModel = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            Assert.AreEqual("PageModel(Title: title, Summary: summary, Namespace: namespace, Assembly: assembly, Syntax: syntax, SeeAlso: [Object, List])", pageModel.ToString());
        }

        [Test]
        public void TestToEquals()
        {
            PageModel pageModel = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            PageModel pageModel2 = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            Assert.AreEqual(pageModel, pageModel2);
        }

        [Test]
        public void TestAreNotEqual()
        {
            PageModel pageModel = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            PageModel pageModel2 = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                    }
            };

            Assert.AreNotEqual(pageModel, pageModel2);
        }

        [Test]
        public void TestGetHashCode()
        {
            PageModel pageModel = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            PageModel pageModel2 = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary",
                SeeAlso = new string[]
                    {
                        "Object",
                        "List"
                    }
            };

            Assert.AreEqual(pageModel.GetHashCode(), pageModel2.GetHashCode());
        }

        [Test]
        public void TestGetHashCodeWithoutSeeAlso()
        {
            PageModel pageModel = new PageModel
            {
                Assembly = "assembly",
                Namespace = "namespace",
                Title = "title",
                Syntax = "syntax",
                Summary = "summary"
            };

            Assert.AreNotEqual(0, pageModel.GetHashCode());
        }
    }
}
