using IglooCastle.Core;
using IglooCastle.Samples;
using Moq;
using NUnit.Framework;
using System;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Tests
{
    [TestFixture]
    class DocumentationBuilderTest
    {
        private ConstructorInfo constructorInfo;
        private DocumentationBuilder documentationBuilder;
        private IHtmlPage htmlPage;
        private IPageModelGenerator pageModelGenerator;

        [SetUp]
        public void SetUp()
        {
            Type type = typeof(Sample);
            constructorInfo = type.GetConstructor(Type.EmptyTypes);

            PageModel pageModel = new PageModel
            {
                Assembly = "something",
                Namespace = "something.else",
                Summary = "summary",
                Title = "title",
                Syntax = "syntax"
            };                   

            pageModelGenerator = Mock.Of<IPageModelGenerator>(g => g.ToPageModel(constructorInfo) == pageModel);
            htmlPage = Mock.Of<IHtmlPage>(h => h.CreateHtmlPage(pageModel) == "html for ctor");
            documentationBuilder = new DocumentationBuilder(htmlPage, pageModelGenerator);
        }

        [Test]
        public void TestBuild()
        {
            var elements = new MemberInfo[] { constructorInfo };
            var fileDefinitions = documentationBuilder.Build(elements).ToArray();
            var expected = new[]
            {
                new FileDefinition("IglooCastle.Samples_Sample_ctor.html", "html for ctor")
            };

            CollectionAssert.AreEqual(expected, fileDefinitions);
        }
    }
}
