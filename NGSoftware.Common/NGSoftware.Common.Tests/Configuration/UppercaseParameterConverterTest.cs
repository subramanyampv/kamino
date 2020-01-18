using Moq;
using NGSoftware.Common.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace NGSoftware.Common.Tests.Configuration
{
    [TestClass]
    public class UppercaseParameterConverterTest
    {
        private Mock<IAppSettings> _mockBackend;
        private UppercaseParameterConverter _uppercaseParameterConverter;

        [TestInitialize]
        public void SetUp()
        {
            _mockBackend = new Mock<IAppSettings>();
            _uppercaseParameterConverter = new UppercaseParameterConverter(_mockBackend.Object);
        }
        
        [TestMethod]
        public void Get_ShouldConvertDotsToUnderscore()
        {
            _mockBackend.Setup(s => s["HELLO_WORLD"]).Returns("value");
            Assert.AreEqual("value", _uppercaseParameterConverter["hello.world"]);
        }
        
        [TestMethod]
        public void Get_ShouldConvertWordsToUppercase()
        {
            _mockBackend.Setup(s => s["ONE_TWO"]).Returns("1 2");
            Assert.AreEqual("1 2", _uppercaseParameterConverter["OneTwo"]);
        }

        [TestMethod]
        public void Get_ShouldNotDuplicateUnderscores()
        {
            _mockBackend.Setup(s => s["TEST_ME"]).Returns("1 2 3");
            Assert.AreEqual("1 2 3", _uppercaseParameterConverter["Test.Me"]);
        }
    }
}