using IglooCastle.Core;
using NUnit.Framework;
using System.Reflection;

namespace IglooCastle.Tests
{
    [TestFixture]
	public class ReflectionExtensionsTest
	{
		[Test]
		public void KeepAccess_FiltersOutNewSlot()
		{
			MethodAttributes beforeFilter = MethodAttributes.NewSlot | MethodAttributes.Private;
			MethodAttributes afterFilter = beforeFilter.KeepAccess();
			Assert.AreEqual(MethodAttributes.Private, afterFilter);
		}

		[Test]
		public void KeepAccess_FiltersOutAbstract()
		{
			MethodAttributes beforeFilter = MethodAttributes.Abstract | MethodAttributes.Public;
			MethodAttributes afterFilter = beforeFilter.KeepAccess();
			Assert.AreEqual(MethodAttributes.Public, afterFilter);
		}

		[Test]
		public void FormatAccess_FiltersOutPrivateScope()
		{
			MethodAttributes beforeFilter = MethodAttributes.Public | MethodAttributes.PrivateScope;
			string result = beforeFilter.FormatAccess();
			Assert.AreEqual("public", result);
		}

		[Test]
		public void FormatAccess_FiltersOutReuseSlot()
		{
			MethodAttributes beforeFilter = MethodAttributes.Family | MethodAttributes.ReuseSlot;
			string result = beforeFilter.FormatAccess();
			Assert.AreEqual("protected", result);
		}
	}
}
