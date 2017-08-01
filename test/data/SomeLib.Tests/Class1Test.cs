using NUnit.Framework;

namespace SomeLib.Tests
{
    [TestFixture]
    public class Class1Test
    {
        [Test]
        public void Test()
        {
            Class1 c = new Class1();
            Assert.IsNotNull(c);
        }
    }
}
