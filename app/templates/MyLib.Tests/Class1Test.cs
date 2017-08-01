using NUnit.Framework;

namespace <%= testName %>
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
