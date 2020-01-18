using Microsoft.VisualStudio.TestTools.UnitTesting;
using NGSoftware.Common;

namespace NGSoftware.Common.Tests
{
	[TestClass]
	public class StringExtensionsTest
	{
		[TestMethod]
		public void ToNullIfEmpty_EmptyString_BecomesNull()
		{
			Assert.IsNull("".ToNullIfEmpty());
		}

		[TestMethod]
		public void SafeHashCode_NullString_IsZero()
		{
			string s = null;
			Assert.AreEqual(0, s.SafeHashCode());
		}

		[TestMethod]
		public void SafeHashCode_NotNullString_IsAsRegularHashCode()
		{
			string s = "hello world";
			Assert.AreEqual(s.GetHashCode(), s.SafeHashCode());
		}
	}
}
