using System;
using System.Text.RegularExpressions;

namespace CVRender
{
	public struct PartialDate : IComparable<PartialDate>, IComparable
	{
		private int _year;
		private int _month;
		private int _day;
		
		public PartialDate(int year)
		{
			if (year <= 0)
			{
				throw new ArgumentOutOfRangeException("year");
			}
			_year = year;
			_month = 0;
			_day = 0;
		}
		
		public PartialDate(int year, int month) : this(year)
		{
			if (month < 1 || month > 12)
			{
				throw new ArgumentOutOfRangeException("month");
			}
			_month = month;
		}
		
		public PartialDate(int year, int month, int day) : this(year, month)
		{
			if (day < 1 || day > 31)
			{
				throw new ArgumentOutOfRangeException("day");
			}
			
			// to try and detect illegal dates
			DateTime dt = new DateTime(year, month, day);
			
			_day = day;
		}
		
		public static PartialDate Parse(string date)
		{
			Regex regex = new Regex(@"^(?<year>\d{4})(-(?<month>\d{2})(-(?<day>\d{2}))?)?$");
			Match match = regex.Match(date);
			if (match == null || !match.Success)
			{
				throw new ArgumentOutOfRangeException();
			}
			int year = Convert.ToInt32(match.Groups["year"].Value);
			if (match.Groups["month"].Success)
			{
				int month = Convert.ToInt32(match.Groups["month"].Value);
				if (match.Groups["day"].Success)
				{
					int day = Convert.ToInt32(match.Groups["day"].Value);
					return new PartialDate(year, month, day);
				}
				else
				{
					return new PartialDate(year, month);
				}
			}
			else
			{
				return new PartialDate(year);
			}
		}
		
		public int Year
		{
			get { return _year; }
		}
		
		public int Month
		{
			get { return _month; }
		}
		
		public int Day
		{
			get {
				return _day;
			}
		}
		
		public override bool Equals(object obj)
		{
			if (obj is PartialDate)
			{
				PartialDate that = (PartialDate)obj;
				return _year == that._year && _month == that._month && _day == that._day;
			}
			else
			{
				return false;
			}
		}
		
		public override int GetHashCode()
		{
			return _year * 365 + _month * 12 + _day;
		}
		
		public override string ToString()
		{
			if (Day >= 1)
			{
				return string.Format("{0}-{1:00}-{2:00}", Year, Month, Day);
			}
			if (Month >= 1)
			{
				return string.Format("{0}-{1:00}", Year, Month);
			}
			return Year.ToString();
		}

		#region IComparable[PartialDate] implementation
		
		public int CompareTo(PartialDate other)
		{
			if (_year < other.Year)
			{
				return -1;
			}
			else if (_year > other.Year)
			{
				return 1;
			}
			else
			{
				if (_month < other.Month)
				{
					return -1;
				}
				else if (_month > other.Month)
				{
					return 1;
				}
				else
				{
					if (_day < other.Day)
					{
						return -1;
					}
					else if (_day > other.Day)
					{
						return 1;
					}
					else
					{
						return 0;
					}
				}
			}
		}
		
		#endregion
		
		#region IComparable implementation
		
		public int CompareTo(object obj)
		{
			return CompareTo((PartialDate)obj);
		}

		#endregion
		
		public static bool operator <(PartialDate a, PartialDate b)
		{
			return a.CompareTo(b) < 0;
		}
		
		public static bool operator >(PartialDate a, PartialDate b)
		{
			return a.CompareTo(b) > 0;
		}
		
		public static bool operator <=(PartialDate a, PartialDate b)
		{
			return a.CompareTo(b) <= 0;
		}

		public static bool operator >=(PartialDate a, PartialDate b)
		{
			return a.CompareTo(b) >= 0;
		}
		
		public static bool operator ==(PartialDate a, PartialDate b)
		{
			return a.Equals(b);
		}
		
		public static bool operator !=(PartialDate a, PartialDate b)
		{
			return !a.Equals(b);
		}
	}
	
}

