using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CVRender
{
	public static class Data
	{
		public static string eventDrivenCV = @"
1980-05-12 born in Athens
1985-09 kindergarten
1986-09 elemenary school
1988 1995 study English
1992-09 high school (gymnasium)

1993 moved to Arta
1993 1995 study guitar
1994-09 high school (lyceum)
1998-09 NTUA in Athens
1999 Teaching assistant
2000 ERMHS VB6
2001 System Administrator
2002 Subsystem of WebSite of ECE NTUA
2003 2004 eRaise

2004-10 2005-03 study German

2005-03 2006-12 Commet
2005-11 2007-05 KEPYES
2006-05 2006-12 Diodos
2006-06 2006-11 Liaison
2006-11 2007-02 VioSys
2007-03 2007-07 des tin psifiaka
2007-09 NCommet & NCCMS
2008-04 2008-07 EduOffers

2008-07-28 moved to Rotterdam
2008-08-04 work at HintTech
2010-11-01 work at Fiserv
";

	}
	
	public struct DateInterval
	{
		private DateTime _from;
		private DateTime _to;

		public DateInterval(DateTime @from, DateTime to)
		{
			_from = @from;
			_to = to;
		}

		public DateTime From
		{
			get { return _from; }
		}

		public DateTime To
		{
			get { return _to; }
		}

		public TimeSpan TimeSpan
		{
			get { return To.Subtract(From); }
		}

		public override bool Equals(object obj)
		{
			if (obj is DateInterval)
			{
				DateInterval other = (DateInterval)obj;
				return From.Equals(other.From) && To.Equals(other.To);
			}

			
			else
			{
				return false;
			}
		}

		public override int GetHashCode()
		{
			return From.GetHashCode() ^ To.GetHashCode();
		}

		public override string ToString()
		{
			return string.Format("{0} - {1}", FormatPartialDate(From), FormatPartialDate(To));
		}

		private static string FormatPartialDate(DateTime dt)
		{
			if (dt.Day != 1)
			{
				return string.Format("{0}-{1}-{2}", dt.Year, dt.Month, dt.Day);
			}

			
			else
			{
				if (dt.Month != 1)
				{
					return string.Format("{0}-{1}", dt.Year, dt.Month);
				}

				
				else
				{
					return dt.Year.ToString();
				}
			}
		}

		public bool EnclosesToAndNotFrom(DateInterval other)
		{
			return other.From <= From && From < other.To && other.To < To;
		}
	}

	public class CVEntry
	{
		public DateInterval When
		{
			get;
			set;
		}
		public string What
		{
			get;
			set;
		}
		public string Where
		{
			get;
			set;
		}
		public string WhatGroup
		{
			get;
			set;
		}

		public CVEntry(int startYear, int howManyYears, string what)
		{
			When = new DateInterval(new DateTime(startYear, 1, 1), new DateTime(startYear + howManyYears, 1, 1));
			What = what;
		}

		public override string ToString()
		{
			return string.Format("{0} {1} {2} {3}", When, Where, WhatGroup, What);
		}
	}

	public class TimeAxisEntry
	{
		public TimeSpan TimeSpan
		{
			get;
			set;
		}
		public CVEntry Entry
		{
			get;
			set;
		}

		internal bool Encloses(DateTime dt, DateInterval partialTimeSpan)
		{
			return dt <= partialTimeSpan.From.Date && partialTimeSpan.To.Date <= dt.Add(TimeSpan);
		}
	}

	public class NonOverlappingTimeAxis
	{
		private List<TimeAxisEntry> _list = new List<TimeAxisEntry>();

		public NonOverlappingTimeAxis(DateTime start)
		{
			Start = start;
		}

		public DateTime Start
		{
			get;
			private set;
		}
		public IEnumerable<TimeAxisEntry> Entries
		{
			get { return _list; }
		}

		public void Add(CVEntry entry)
		{
			if (Overlaps(entry))
			{
				throw new ArgumentOutOfRangeException();
			}
			
			DateTime dt = Start;
			foreach (TimeAxisEntry existingEntry in _list)
			{
				if (existingEntry.Entry == null && existingEntry.Encloses(dt, entry.When))
				{
					// partition existing entry
					return;
				}
				dt = dt.Add(existingEntry.TimeSpan);
			}
			
			TimeSpan ts1 = entry.When.From.Subtract(dt);
			if (ts1.Days > 0)
			{
				_list.Add(new TimeAxisEntry { TimeSpan = ts1 });
			}
			_list.Add(new TimeAxisEntry { TimeSpan = entry.When.TimeSpan, Entry = entry });
			
		}

		public bool Overlaps(CVEntry entry)
		{
			DateTime oldFrom = Start;
			DateTime newFrom = entry.When.From.Date;
			DateTime newTo = entry.When.To.Date;
			foreach (TimeAxisEntry existingEntry in _list)
			{
				DateTime oldTo = oldFrom.Add(existingEntry.TimeSpan);
				if ((oldFrom <= newFrom && newFrom < oldTo) || (oldFrom <= newTo && newTo < oldTo))
				{
					return true;
				}
				
				oldFrom = oldTo;
			}
			return false;
		}
		
		
	}

	public class TimeAxis
	{
		private List<NonOverlappingTimeAxis> _lanes = new List<NonOverlappingTimeAxis>();

		public TimeAxis(DateTime start)
		{
			Start = start;
		}

		public DateTime Start
		{
			get;
			private set;
		}

		public void Add(CVEntry entry)
		{
			NonOverlappingTimeAxis lane;
			if (NeedsNewLane(entry))
			{
				lane = new NonOverlappingTimeAxis(Start);
				_lanes.Add(lane);
			}

			
			else
			{
				lane = _lanes.First(l => !l.Overlaps(entry));
			}
			
			lane.Add(entry);
		}

		public void AddRange(IEnumerable<CVEntry> entries)
		{
			foreach (CVEntry entry in entries)
			{
				Add(entry);
			}
		}

		public IEnumerable<NonOverlappingTimeAxis> Lanes
		{
			get { return _lanes; }
		}

		private bool NeedsNewLane(CVEntry entry)
		{
			return _lanes.Count == 0 || _lanes.All(lane => lane.Overlaps(entry));
		}
		
	}

	public class TimeAxisElement
	{
		public int Height
		{
			get;
			set;
		}
		public TimeAxisElement Previous
		{
			get;
			set;
		}
		public TimeAxisElement Next
		{
			get;
			set;
		}
	}

	public class GridCell
	{
		public TimeAxisEntry Entry
		{
			get;
			set;
		}
		public GridRow Row
		{
			get;
			set;
		}
		public GridColumn Column
		{
			get;
			set;
		}
	}

	public class GridBlock
	{
		public TimeAxisEntry Entry
		{
			get;
			set;
		}
		public int Top
		{
			get;
			set;
		}
		public int Height
		{
			get;
			set;
		}
	}

	public class GridRow
	{
		private Grid _owner;

		internal GridRow(Grid owner)
		{
			_owner = owner;
		}

		public DateInterval When
		{
			get;
			set;
		}
		public int Height
		{
			get;
			set;
		}
		public int Top
		{
			get
			{
				int result = 0;
				foreach (GridRow row in _owner.Rows)
				{
					if (row == this)
					{
						break;
					}
					result += row.Height;
				}
				return result;
			}
		}
	}

	public class GridColumn
	{
		private Grid _owner;
		internal GridColumn(Grid owner)
		{
			_owner = owner;
		}
		public int Width
		{
			get;
			set;
		}

		internal IEnumerable<GridCell> Cells
		{
			get { return _owner.Cells.Where(cell => cell.Column == this); }
		}

		public IEnumerable<GridBlock> Blocks
		{
			get
			{
				var q = from cell in Cells
					group cell by cell.Entry into g
					select g;
				foreach (var grouping in q)
				{
					yield return new GridBlock { Entry = grouping.Key, Top = grouping.First().Row.Top, Height = grouping.Sum(cell => cell.Row.Height) };
				}
			}
		}
	}

	public class Grid
	{
		private List<GridRow> _rows = new List<GridRow>();
		private List<GridColumn> _columns = new List<GridColumn>();
		private List<GridCell> _cells = new List<GridCell>();

		private IEnumerable<GridRow> EnsureRows(DateInterval when)
		{
			int i = 0;
			List<GridRow> match = new List<GridRow>();
			while (i < _rows.Count)
			{
				GridRow row = _rows[i];
				
				if ((row.When.From <= when.From && when.From < row.When.To) || (row.When.From < when.To && when.To <= row.When.To) || (row.When.From >= when.From && row.When.To <= when.To))
				{
					match.Add(row);
				}
				
				i++;
			}
			
			if (match.Count == 0)
			{
				GridRow row = new GridRow(this) { Height = 50, When = when };
				_rows.Add(row);
				match.Add(row);
			}

			
			else
			{
				i = 0;
				while (i < match.Count)
				{
					GridRow matching = match[i];
					if (matching.When.EnclosesToAndNotFrom(when))
					{
						match.Insert(i + 1, SplitRow(matching, when.To));
					}
					i++;
				}
				
				match.RemoveAll(row => row.When.From >= when.To || row.When.To <= when.From);
			}
			
			return match;
		}

		public int Width
		{
			get { return Columns.Sum(col => col.Width); }
		}

		public int Height
		{
			get { return Rows.Sum(row => row.Height); }
		}

		public void Render(TimeAxis timeAxis)
		{
			int idx = 0;
			foreach (NonOverlappingTimeAxis lane in timeAxis.Lanes)
			{
				GridColumn column = new GridColumn(this) { Width = 200 };
				_columns.Add(column);
				
				DateTime dt = lane.Start;
				
				foreach (TimeAxisEntry entry in lane.Entries)
				{
					DateTime dtStop = dt.Add(entry.TimeSpan);
					
					foreach (GridRow row in EnsureRows(new DateInterval(dt, dtStop)))
					{
						_cells.Add(new GridCell { Entry = entry, Row = row, Column = column });
					}
					
					dt = dtStop;
				}
			}
			
			//PartitionInYears();
		}

		internal GridRow SplitRow(GridRow row, DateTime partition)
		{
			if (!(row.When.From < partition && partition < row.When.To))
			{
				throw new ArgumentOutOfRangeException();
			}
			
			GridRow b = new GridRow(this) { Height = row.Height, When = new DateInterval(partition, row.When.To) };
			
			row.When = new DateInterval(row.When.From, partition);
			// modify old row
			_rows.Insert(_rows.IndexOf(row) + 1, b);
			
			CloneCells(row, b);
			
			return b;
		}

		private void CloneCells(GridRow row, GridRow b)
		{
			IEnumerable<GridCell> cells = _cells.Where(cell => cell.Row == row).ToList();
			_cells.AddRange(cells.Select(cell => new GridCell { Column = cell.Column, Row = b, Entry = cell.Entry }));
		}

		public void PartitionInYears()
		{
			int i = 0;
			while (i < _rows.Count)
			{
				GridRow row = _rows[i];
				
				DateTime dt = row.When.From;
				if (dt.Day == 1 && dt.Month == 1)
				{
					dt = dt.AddYears(1);
				}

				
				else
				{
					dt = new DateTime(dt.Year + 1, 1, 1);
				}
				
				if (row.When.To > dt)
				{
					SplitRow(row, dt);
				}
				
				i++;
			}
		}

		public IEnumerable<GridRow> Rows
		{
			get { return _rows; }
		}

		public IEnumerable<GridColumn> Columns
		{
			get { return _columns; }
		}

		internal IEnumerable<GridCell> Cells
		{
			get { return _cells; }
		}
		
	}
}
