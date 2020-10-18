using System;
using System.Linq;
using System.Text.RegularExpressions;
using NUnit.Framework;

namespace CVRender.Tests
{
	[TestFixture()]
	public class PlainTextParserTest
	{
		[Test()]
		public void TestCase()
		{
			string input = CVRender.Data.eventDrivenCV;
			
			Assert.IsNotNull(input);
			Assert.IsNotEmpty(input);
			
			var lines = from line in input.Split('\r', '\n')
				where line != null && line.Trim().Length > 0
				select line.Trim();
			foreach (string line in lines)
			{
				Assert.IsNotNull(line);
				Assert.IsNotEmpty(line);
				Console.WriteLine("Testing {0}", line);
				Regex ymdStart = new Regex(@"^(?<year>\d{4})(-(?<month>\d{2})(-(?<day>\d{2}))?)?( (?<stopyear>\d{4})(-(?<stopmonth>\d{2})(-(?<stopday>\d{2}))?)?)? (?<text>.+)$");
				Assert.IsTrue(ymdStart.IsMatch(line), "line " + line + " did not match");
				Match match = ymdStart.Match(line);
				Console.WriteLine(match.Groups["year"].Value);
				Console.WriteLine(match.Groups["month"].Value);
				Console.WriteLine(match.Groups["day"].Value);
				Console.WriteLine(match.Groups["stopyear"].Value);
				Console.WriteLine(match.Groups["stopmonth"].Value);
				Console.WriteLine(match.Groups["stopday"].Value);
				Console.WriteLine(match.Groups["text"].Value);
				
				PartialDate start = CreatePartialDate(
					match.Groups["year"].Value,
					match.Groups["month"].Value,
					match.Groups["day"].Value);
				Console.WriteLine(start);
				
				if (match.Groups["stopyear"].Success)
				{
					PartialDate stop = CreatePartialDate(
						match.Groups["stopyear"].Value,
						match.Groups["stopmonth"].Value,
						match.Groups["stopday"].Value);
					Console.WriteLine(stop);
				}
			}
		
		}
		
		private string FormatPartialDate(string year, string month, string day)
		{
			string buf = year;
			if (!string.IsNullOrEmpty(month))
			{
				buf += "-" + month;
				if (!string.IsNullOrEmpty(day))
				{
					buf += "-" + day;
				}
			}
			return buf;
		}
		
		private PartialDate CreatePartialDate(string year, string month, string day)
		{
			return PartialDate.Parse(FormatPartialDate(year, month, day));
		}
		
	}
}

