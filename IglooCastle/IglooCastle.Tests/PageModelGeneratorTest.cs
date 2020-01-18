using IglooCastle.Core;
using IglooCastle.Samples;
using Moq;
using NUnit.Framework;
using System;
using System.Reflection;

namespace IglooCastle.Tests
{
    [TestFixture]
    class PageModelGeneratorTest
    {
        private ConstructorInfo constructorInfo;
        private PageModelGenerator pageModelGenerator;
        private IDocumentationProvider documentationProvider;

        [SetUp]
        public void SetUp()
        {
            Type type = typeof(Sample);
            constructorInfo = type.GetConstructor(Type.EmptyTypes);
            documentationProvider = Mock.Of<IDocumentationProvider>(p => p.GetSummary(constructorInfo) == "my summary");
            pageModelGenerator = new PageModelGenerator(documentationProvider);
        }

        [Test]
        public void TestPageModel()
        {
            PageModel pageModel = pageModelGenerator.ToPageModel(constructorInfo);
            Assert.AreEqual(new PageModel
            {
                Title = "Sample Constructor",
                Summary = @"my summary",
                Namespace = "IglooCastle.Samples",
                Assembly = "IglooCastle.Samples",
                Syntax = "public Sample()"
            }, pageModel);
        }
    }
}
