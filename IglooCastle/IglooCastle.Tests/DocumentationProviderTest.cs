using IglooCastle.Core;
using IglooCastle.Samples;
using NUnit.Framework;
using System;
using System.Reflection;
using Moq;

namespace IglooCastle.Tests
{
    [TestFixture]
    class DocumentationProviderTest
    {
        private ConstructorInfo constructorInfo;
        private DocumentationProvider documentationProvider;
        private IPageProviderFactory pageProviderFactory;

        [SetUp]
        public void SetUp()
        {
            Type type = typeof(Sample);
            constructorInfo = type.GetConstructor(Type.EmptyTypes);
            pageProviderFactory = Mock.Of<IPageProviderFactory>();
            documentationProvider = new DocumentationProvider(pageProviderFactory);
        }

        [Test]
        public void TestConstructorGetSummary()
        {
            string summary = documentationProvider.GetSummary(constructorInfo);
            Assert.AreEqual("Initializes an instance of the <see cref=\"T:IglooCastle.Samples.Sample\" /> class.", summary);
        }
    }
}
