using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace <%= testName %>
{
	[TestClass]
	public class Class1Test
	{
		[TestMethod]
		public void Test()
		{
			Class1 c = new Class1();
			Assert.IsNotNull(c);
		}
	}
}
