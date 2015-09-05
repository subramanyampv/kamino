using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;

namespace <%= testName %>
{
	[TestFixture]
    public class ProgramTest
    {
		[Test]
		public void Test()
		{
			Program program = new Program();
			Assert.IsNotNull(program);
		}
    }
}
