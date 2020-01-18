using System;
using NUnit.Framework;

namespace CVRender.Tests
{
	[TestFixture()]
	public class PartialDateTest
	{
		#region Create Only Year
		
		[Test()]
		public void CreateOnlyYear_Success()
		{
			PartialDate date = new PartialDate(2010);
			Assert.AreEqual(2010, date.Year);
		}
		
		[Test]
		public void CreateOnlyYear_ZeroYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() => {
                PartialDate date = new PartialDate(0);
            });
		}
		
		[Test]
		public void CreateOnlyYear_NegativeYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() => {
                PartialDate date = new PartialDate(-1);
            });
        }

        #endregion

        #region Create Year and Month

        [Test]
		public void CreateYearMonth_Success()
		{
			PartialDate date = new PartialDate(2010, 10);
			Assert.IsNotNull(date);
			Assert.AreEqual(2010, date.Year);
			Assert.AreEqual(10, date.Month);
		}
		
		[Test]
		public void CreateYearMonth_ZeroYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(0, 10);
            });
		}

		[Test]
		public void CreateYearMonth_NegativeYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(-1, 10);
            });
		}
		
		[Test]
		public void CreateYearMonth_ZeroMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, 0);
            });
		}
		
		[Test]
		public void CreateYearMonth_NegativeMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, -1);
            });
		}
		
		[Test]
		public void CreateYearMonth_ThirteenMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, 13);
            });
		}
		
		#endregion
		
		#region Create Year Month and Day
		
		[Test]
		public void CreateYearMonthDay_Success()
		{
			PartialDate date = new PartialDate(2010, 10, 23);
			Assert.IsNotNull(date);
			Assert.AreEqual(2010, date.Year);
			Assert.AreEqual(10, date.Month);
			Assert.AreEqual(23, date.Day);
		}
		
		[Test]
		public void CreateYearMonthDay_ZeroYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(0, 10, 1);
            });
		}

		[Test]
		public void CreateYearMonthDay_NegativeYear_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(-1, 10, 1);
            });
		}

		[Test]
		public void CreateYearMonthDay_ZeroMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, 0, 1);
            });
		}

		[Test]
		public void CreateYearMonthDay_NegativeMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, -1, 1);
            });
		}

		[Test]
		public void CreateYearMonthDay_ThirteenMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, 13, 1);
            });
		}
		
		[Test]
		public void CreateYearMonthDay_IllegalDay_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate date = new PartialDate(2010, 9, 31);
            });
		}
		
		#endregion
		
		[Test]
		public void Equals_Success()
		{
			PartialDate a = new PartialDate(2010);
			PartialDate b = new PartialDate(2010);
			PartialDate c = new PartialDate(2011);
			PartialDate d = new PartialDate(2010, 10);
			PartialDate e = new PartialDate(2010, 10);
			PartialDate f = new PartialDate(2010, 11);
			PartialDate g = new PartialDate(2010, 10, 23);
			PartialDate h = new PartialDate(2010, 10, 23);
			PartialDate i = new PartialDate(2010, 10, 24);
			
			Assert.AreEqual(a, a);
			Assert.AreEqual(a, b);
			Assert.AreNotEqual(a, c);
			Assert.AreNotEqual(a, d);
			Assert.AreNotEqual(a, e);
			Assert.AreNotEqual(a, f);
			Assert.AreNotEqual(a, g);
			Assert.AreNotEqual(a, h);
			Assert.AreNotEqual(a, i);
			
			Assert.AreNotEqual(d, a);
			Assert.AreNotEqual(d, b);
			Assert.AreNotEqual(d, c);
			Assert.AreEqual(d, d);
			Assert.AreEqual(d, e);
			Assert.AreNotEqual(d, f);
			Assert.AreNotEqual(d, g);
			Assert.AreNotEqual(d, h);
			Assert.AreNotEqual(d, i);
			
			Assert.AreNotEqual(g, a);
			Assert.AreNotEqual(g, b);
			Assert.AreNotEqual(g, c);
			Assert.AreNotEqual(g, d);
			Assert.AreNotEqual(g, e);
			Assert.AreNotEqual(g, f);
			Assert.AreEqual(g, g);
			Assert.AreEqual(g, h);
			Assert.AreNotEqual(g, i);
		}
		
		[Test]
		public void GetHashCode_Success()
		{
			PartialDate a = new PartialDate(2010);
			PartialDate b = new PartialDate(2010);
			PartialDate c = new PartialDate(2011);
			PartialDate d = new PartialDate(2010, 10);
			PartialDate e = new PartialDate(2010, 10);
			PartialDate f = new PartialDate(2010, 11);
			PartialDate g = new PartialDate(2010, 10, 23);
			PartialDate h = new PartialDate(2010, 10, 23);
			PartialDate i = new PartialDate(2010, 10, 24);
			
			Assert.AreEqual(a.GetHashCode(), a.GetHashCode());
			Assert.AreEqual(a.GetHashCode(), b.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), c.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), d.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), e.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), f.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), g.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), h.GetHashCode());
			Assert.AreNotEqual(a.GetHashCode(), i.GetHashCode());
			
			Assert.AreNotEqual(d.GetHashCode(), a.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), b.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), c.GetHashCode());
			Assert.AreEqual(d.GetHashCode(), d.GetHashCode());
			Assert.AreEqual(d.GetHashCode(), e.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), f.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), g.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), h.GetHashCode());
			Assert.AreNotEqual(d.GetHashCode(), i.GetHashCode());
			
			Assert.AreNotEqual(g.GetHashCode(), a.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), b.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), c.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), d.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), e.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), f.GetHashCode());
			Assert.AreEqual(g.GetHashCode(), g.GetHashCode());
			Assert.AreEqual(g.GetHashCode(), h.GetHashCode());
			Assert.AreNotEqual(g.GetHashCode(), i.GetHashCode());
		}

		[Test]
		public void ToString_Success()
		{
			PartialDate a = new PartialDate(2010);
			PartialDate b = new PartialDate(2010, 10);
			PartialDate c = new PartialDate(2010, 10, 23);
			Assert.AreEqual("2010", a.ToString());
			Assert.AreEqual("2010-10", b.ToString());
			Assert.AreEqual("2010-10-23", c.ToString());
		}
		
		[Test]
		public void Operators_Success()
		{
			PartialDate a = new PartialDate(2010);
			PartialDate b = new PartialDate(2010);
			PartialDate c = new PartialDate(2011);
			PartialDate d = new PartialDate(2010, 10);
			PartialDate e = new PartialDate(2010, 10);
			PartialDate f = new PartialDate(2010, 11);
			PartialDate g = new PartialDate(2010, 10, 23);
			PartialDate h = new PartialDate(2010, 10, 23);
			PartialDate i = new PartialDate(2010, 10, 24);
			
			Assert.That(a == b);
			Assert.That(a != c);
			Assert.That(a <= b);
			Assert.That(a < c);
			Assert.That(a < d);
			Assert.That(a < e);
			
			Assert.That(i > h);
			Assert.That(i < f);
			Assert.That(f > a);
			Assert.That(c > f);
			Assert.That(g != i);
		}		
		
		[Test]
		public void Parse_Success()
		{
			string[] dates = new[] { "2010", "2010-10", "2010-09", "2010-10-23", "2010-09-09" };
			foreach (string date in dates)
			{
				Assert.AreEqual(date, PartialDate.Parse(date).ToString());
			}
		}
		
		[Test]
		public void Parse_Null_Exception()
		{
            Assert.Throws<ArgumentNullException>(() =>
            {
                PartialDate.Parse(null);
            });
		}
		
		[Test]
		public void Parse_Empty_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate.Parse(string.Empty);
            });
		}
		
		[Test]
		public void Parse_Invalid_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate.Parse("2010 January");
            });
		}
		
		[Test]
		public void Parse_MissingMonth_Exception()
		{
            Assert.Throws<ArgumentOutOfRangeException>(() =>
            {
                PartialDate.Parse("2010-0-12");
            });
		}
	}
}

