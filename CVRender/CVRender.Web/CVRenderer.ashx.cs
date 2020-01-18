using System;
using System.Web;
using System.Web.UI;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;

namespace CVRender.Web
{
	public static class MyCV
	{
		public static IEnumerable<CVEntry> GetSchool()
		{
			yield return new CVEntry(1985, 1, "Kindergarten");
			yield return new CVEntry(1986, 6, "Elementary School");
			yield return new CVEntry(1992, 3, "High School (Gymnasium)");
			yield return new CVEntry(1995, 3, "High School (Lyceum)");
			yield return new CVEntry(1988, 8, "English");
			yield return new CVEntry(1998, 6, "NTUA");
			yield return new CVEntry(1993, 3, "Guitar");
		}

		public static IEnumerable<CVEntry> GetWork()
		{
			yield return new CVEntry(1999, 1, "NTUA Labs");
			yield return new CVEntry(2000, 1, "ERMHS");
			yield return new CVEntry(2001, 1, "System Administrator");
		}
	}

	public static class Renderer
	{
		public static Grid Prepare(IEnumerable<IEnumerable<CVEntry>> entries)
		{
			Grid grid = new Grid();


			foreach (IEnumerable<CVEntry> entry in entries)
			{
				TimeAxis axis = new TimeAxis(new DateTime(1980, 12, 5));
				axis.AddRange(entry);

				grid.Render(axis);
			}
			return grid;
		}

		public static void Render(Grid grid, Graphics g, Font font)
		{
			int y = 0;
			foreach (GridRow row in grid.Rows)
			{
				g.DrawString(string.Format("{0}", row.When), font, Brushes.Black, 0, y);

				y += row.Height;
			}

			int x = 200;
			foreach (GridColumn column in grid.Columns)
			{
				foreach (GridBlock block in column.Blocks)
				{
					if (block.Entry.Entry != null)
					{
						g.DrawRectangle(Pens.Black, x, block.Top, column.Width, block.Height);
						g.DrawString(block.Entry.Entry.What, font, Brushes.Black, new RectangleF(x, block.Top, column.Width, block.Height));
						g.DrawString(block.Entry.Entry.When.ToString(), font, Brushes.Black, new RectangleF(x, block.Top + 25, column.Width, block.Height));

					}
					else
					{
						g.FillRectangle(Brushes.LightCyan, x, block.Top, column.Width, block.Height);

						g.DrawString((block.Entry.TimeSpan.Days / 365.0).ToString(), font, Brushes.Black, new RectangleF(x, block.Top + 25, column.Width, block.Height));
					}
				}

				x += column.Width;
			}

			//TimeAxis axis = new TimeAxis();
			//axis.Start = new DateTime(1980, 12, 5);
			//foreach (CVEntry entry in entries)
			//{
			//    axis.Add(entry);
			//}

			/*Font font = new Font("Tahoma", 10);
			const int columnWidth = 200;

			Dictionary<PartialDate, float> y = new Dictionary<PartialDate, float>();
			for (int year = 1980; year < DateTime.Now.Year; year++)
			{

			}

			foreach (CVEntry entry in entries)
			{
				SizeF size = g.MeasureString(entry.What, font, columnWidth);
				y[entry.When.From] = 0;
				y[entry.When.To] = size.Height;
			}*/
		}
	}

	public class CVRenderer : System.Web.IHttpHandler
	{

		public virtual bool IsReusable
		{
			get { return false; }
		}

		public virtual void ProcessRequest(HttpContext context)
		{
			RenderImage(context.Response);
		}

		class Printer
		{
			private Font font;
			private int rowHeight;
			private Graphics g;
			private int x;
			private int y;
			private int tabWidth;
			private int startX;

			public Printer(Graphics g, Font font, int startX, int startY, int rowHeight, int tabWidth)
			{
				this.g = g;
				this.font = font;
				this.startX = startX;
				this.x = startX;
				this.y = startY;
				this.rowHeight = rowHeight;
				this.tabWidth = tabWidth;
			}

			private void DoWrite(string text)
			{
				if (!string.IsNullOrEmpty(text) && text.Trim().Length > 0)
				{
					g.DrawString(text, font, Brushes.Black, x, y);
				}
			}

			public void Write(string text)
			{
				string[] tabs = text.Split('\t');
				foreach (string tab in tabs)
				{
					DoWrite(tab);
					x += tabWidth;
				}
			}

			public void WriteLine(string text)
			{
				Write(text);
				y += rowHeight;
				x = startX;
			}
		}

		private void RenderImage(HttpResponse response)
		{
			response.ContentType = "image/png";

			int width = 900;
			int height = 2250;

			int whenStartX = 0;
			int whenStopX = 100;
			int whereStartX = 100;
			int whereStopX = 200;
			int whatStartX = 300;
			int studyStartX = 400;
			int workStartX = 600;

			int rowHeight = 20;

			using (MemoryStream output = new MemoryStream())
			{
				Grid grid = Renderer.Prepare(new[] { MyCV.GetSchool(), MyCV.GetWork() });
				width = grid.Width + 201; // left column + 1px for border
				height = grid.Height + 1; // 1px for border
				using (Bitmap bmp = new Bitmap(width, height))
				{
					using (Graphics g = Graphics.FromImage(bmp))
					{
						using (Font f = new Font("Tahoma", 10))
						{
							g.FillRectangle(Brushes.White, 0, 0, width, height);

							Renderer.Render(grid, g, f);

							/*g.FillEllipse(Brushes.AliceBlue, 0, 0, width, height);
							
							// headers
							g.DrawString("When?", f, Brushes.Black, whenStartX, 0, StringFormat.GenericDefault);
							g.DrawString("Where?", f, Brushes.Black, whereStartX, 0);
							g.DrawString("What?", f, Brushes.Black, whatStartX, 0);
							g.DrawString("I am alive", f, Brushes.Black, whatStartX, rowHeight);
							g.DrawString("I study", f, Brushes.Black, studyStartX, rowHeight);
							g.DrawString("I work", f, Brushes.Black, workStartX, rowHeight);

							// years
							Printer yearPrinter = new Printer(g, f, 0, 2 * rowHeight, rowHeight, 50);
							for (int year = 1980; year <= 2010; year++)
							{
								bool showMonths = year >= 2004;
								if (showMonths)
								{
									for (int month = 1; month <= 12; month++)
									{
										if (month == 1)
										{
											yearPrinter.WriteLine(string.Format("{0}\t{1}", year, month));
										}
										else
										{
											yearPrinter.WriteLine(string.Format("\t{0}", month));
										}
									}
								}
								else
								{
									yearPrinter.WriteLine(year.ToString());
								}
							}

							// where
							RenderCities(whereStartX, rowHeight, whereStopX, g, f);*/
						}
					}
					bmp.Save(output, ImageFormat.Png);
				}
				byte[] bt = output.ToArray();
				response.OutputStream.Write(bt, 0, bt.Length);
			}
		}

		private void RenderCities(int whereStartX, int rowHeight, int whereStopX, Graphics g, Font f)
		{
			var cities =
				new[] {
					new {
						City = "Athens",
						From = new DateTime(1980, 1, 1),
						To = new DateTime(1992, 1, 1)
					},
					new {
						City = "Arta",
						From = new DateTime(1993, 1, 1),
						To = new DateTime(1997, 1, 1)
					},
					new {
						City = "Athens",
						From = new DateTime(1998, 1, 1),
						To = new DateTime(2008, 7, 27)
					},
					new {
						City = "Rotterdam",
						From = new DateTime(2008, 7, 28),
						To = DateTime.Now
					},
				};

			StringFormat sf = new StringFormat(StringFormatFlags.DirectionVertical);
			Brush brush = Brushes.Orange;
			int x = whereStartX;
			int y = 2 * rowHeight;
			int width = whereStopX - whereStartX;
			int height = 0;

			foreach (var city in cities)
			{
				height = CalculateHeightOfYears(city.From, city.To, rowHeight);

				g.FillRectangle(brush, x, y, width, height);
				g.DrawString(city.City, f, Brushes.Black, x, y, sf);

				brush = brush == Brushes.Orange ? Brushes.YellowGreen : Brushes.Orange;
				y += height;
			}
		}

		private int CalculateHeightOfYears(DateTime start, DateTime stop, int rowHeight)
		{
			int result = 0;

			for (int i = start.Year; i <= stop.Year; i++)
			{
				if (i >= 2004)
				{
					result += 12 * rowHeight;

					if (i == start.Year)
					{
						result -= (start.Month - 1) * rowHeight;
					}
					if (i == stop.Year)
					{
						result -= (12 - stop.Month) * rowHeight;
					}
				}
				else
				{
					result += rowHeight;
				}
			}
			return result;
		}
	}
}
