using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NGSoftware.Common.Configuration;

namespace NGSoftware.Common.Tests.Configuration
{
    [TestClass]
    public class AppSettingsCompositeTest
    {
        private AppSettingsComposite _appSettingsComposite;
        private Mock<IAppSettings> _mockSecond;
        private Mock<IAppSettings> _mockFirst;

        [TestInitialize]
        public void SetUp()
        {
            _mockFirst = new Mock<IAppSettings>();
            _mockSecond = new Mock<IAppSettings>();
            _appSettingsComposite = new AppSettingsComposite(
                new[] { _mockFirst.Object, _mockSecond.Object }
            );
        }
        
        [TestMethod]
        public void Get_MissingKey_ShouldReturnNull()
        {
            Assert.IsNull(_appSettingsComposite["missing key"]);
        }

        [TestMethod]
        public void Get_FirstHasValue_ShouldReturnValue()
        {
            _mockFirst.SetupGet(s => s["key"]).Returns("value");
            Assert.AreEqual("value", _appSettingsComposite["key"]);
        }
        
        [TestMethod]
        public void Get_SecondHasValue_ShouldReturnValue()
        {
            _mockSecond.SetupGet(s => s["key"]).Returns("value");
            Assert.AreEqual("value", _appSettingsComposite["key"]);
        }
    }
}