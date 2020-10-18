using IglooCastle.Core;
using IglooCastle.Core.Elements;
using NUnit.Framework;
using System;
using System.Linq;
using System.Reflection;
using IglooCastle.Samples;

namespace IglooCastle.Tests
{
    [TestFixture]
	public class FilenameProviderTest
	{
		private Documentation _documentation;

		[SetUp]
		public void SetUp()
		{
			_documentation = new Documentation();
			_documentation.Scan(typeof(Simple).Assembly);
		}

		[Test]
		public void TestNamespace()
		{
			const string expected = "N_IglooCastle.Samples.html";
			FilenameProvider filenameProvider = new FilenameProvider();
			Assert.AreEqual(expected, filenameProvider.Filename(_documentation.Namespaces[0].Namespace));
		}

		[Test]
		public void TestMethodWithStringAlias()
		{
			const string expected = "M_IglooCastle.Samples.Simple.Greet-string.html";
			TestMethod(expected, typeof(Simple), "Greet");
		}

		[Test]
		public void TestMethodWithParameterOfGenericType()
		{
			const string expected =
                "M_IglooCastle.Samples.Simple.GreetMany-System.Collections.Generic.IEnumerable`string.html";

			TestMethod(expected, typeof(Simple), "GreetMany");
		}

		private void TestMethod(string expected, Type type, string methodName)
		{
			TypeElement targetTypeElement = _documentation.Types.Single(t => t.Member == type);
			MethodElement targetMethod = targetTypeElement.Methods.Single(m => m.Name == methodName);
			FilenameProvider filenameProvider = new FilenameProvider();
			Assert.AreEqual(expected, filenameProvider.Filename(targetMethod.Member));
		}
	}
}
