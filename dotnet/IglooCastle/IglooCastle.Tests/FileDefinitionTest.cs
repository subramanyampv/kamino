using IglooCastle.Core;
using NUnit.Framework;

namespace IglooCastle.Tests
{
    [TestFixture]
    class FileDefinitionTest
    {
        [Test]
        public void TestCreate()
        {
            var fileDefinition = new FileDefinition("file.txt", "Hello, world!");
            Assert.AreEqual("file.txt", fileDefinition.Filename);
            Assert.AreEqual("Hello, world!", fileDefinition.Contents);
        }

        [Test]
        public void TestEquals()
        {
            var fileDefinition1 = new FileDefinition("file.txt", "Hello, world!");
            var fileDefinition2 = new FileDefinition("file.txt", "Hello, world!");
            Assert.AreEqual(fileDefinition1, fileDefinition2);
        }

        [Test]
        public void TestNotEquals()
        {
            var fileDefinition1 = new FileDefinition("file.txt", "Hello, world!");
            var fileDefinition2 = new FileDefinition("file2.txt", "Hello, world!");
            Assert.AreNotEqual(fileDefinition1, fileDefinition2);
        }

        [Test]
        public void TestToString()
        {
            var fileDefinition = new FileDefinition("file.txt", "Hello, world!");
            Assert.AreEqual("FileDefinition(Filename: 'file.txt', Contents: 'Hello, world!')", fileDefinition.ToString());
        }
    }
}
