using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace SshDemo
{
    public partial class GraphControl : UserControl
    {
        internal const int MaxPoints = 400;
        private readonly ObservableCollection<Series> _series = new ObservableCollection<Series>();

        public GraphControl()
        {
            InitializeComponent();
        }

        public IList<Series> Series { get { return _series; } }

        public StateController StateController { get; set; }

        private void pbGraph_Paint(object sender, PaintEventArgs e)
        {
            if (!_series.Any())
            {
                return;
            }

            var g = e.Graphics;
            g.FillRectangle(Brushes.White, pbGraph.ClientRectangle);

            const int VerticalLines = 10;
            for (int i = 0; i < VerticalLines; i++)
            {
                var y = i * pbGraph.ClientSize.Height / VerticalLines;
                g.DrawLine(Pens.LightGray, 0, y, pbGraph.ClientSize.Width, y);
            }

            int idx = 0;
            foreach (var s in _series)
            {
                DrawSeries(g, s, idx++);
            }
        }

        private void DrawSeries(Graphics g, Series series, int seriesIndex)
        {
            var height = pbGraph.ClientSize.Height - 1;
            var brush = new SolidBrush(series.Color);
            var pen = new Pen(series.Color);

            var textOffsetX = seriesIndex*40;
            g.DrawString(series.Floor.ToString(), SystemFonts.DefaultFont, brush, textOffsetX, height - 20);
            g.DrawString(series.Ceil.ToString(), SystemFonts.DefaultFont, brush, textOffsetX, 20);

            var segmentWidth = pbGraph.ClientSize.Width * 1.0f / MaxPoints;

            var scaledPoints =
                series.Points().Select(pt => height - ((pt - series.Floor) * height * 1.0 / (series.Ceil - series.Floor))).ToList();

            int startingPoint = MaxPoints - scaledPoints.Count();
            var segments = scaledPoints.Select((pt, idx) => new
            {
                LastX = (startingPoint + idx - 1) * segmentWidth,
                NextX = (idx + startingPoint) * segmentWidth,
                LastY = idx > 0 ? scaledPoints[idx - 1] : scaledPoints[0],
                NewY = pt
            });

            foreach (var s in segments)
            {
                g.DrawLine(pen, s.LastX, (float)s.LastY, s.NextX, (float)s.NewY);
            }
        }
    }
}
