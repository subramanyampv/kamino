using System;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace SshDemo
{
    class LogView : IView
    {
        private readonly GraphControl _gcLogs;
        private readonly int?[] _lastCount;
        private readonly IStateControllerHost _host;
        private readonly Label _lblLogs;
        private readonly Timer _timerLogs;
        private readonly Timer _timerLogsRepaint;

        public LogView(IStateControllerHost host, GraphControl gcLogs, Label lblLogs, Timer timerLogs,
                       Timer timerLogsRepaint)
        {
            _host = host;
            _gcLogs = gcLogs;
            _lblLogs = lblLogs;
            _lastCount = new int?[Enum.GetValues(typeof (LogLevel)).Length];
            _timerLogs = timerLogs;
            _timerLogsRepaint = timerLogsRepaint;
            host.Controller.StateChanged += Controller_StateChanged;
        }

        void Controller_StateChanged(object sender, StateChangedEventArgs e)
        {
            if (e.OldState == ConnectionState.Connecting && e.NewState == ConnectionState.Open)
            {
                // just opened up fresh connection!
                _timerLogs.Start();
                _timerLogsRepaint.Start();
            }

            if (e.NewState == ConnectionState.Closed)
            {
                _timerLogs.Stop();
                _timerLogsRepaint.Stop();
            }
        }

        public void OnFormLoad()
        {
            _gcLogs.Series.Add(new Series(Color.DeepSkyBlue));
            _gcLogs.Series.Add(new Series(Color.GreenYellow));
            _gcLogs.Series.Add(new Series(Color.Gold));
            _gcLogs.Series.Add(new Series(Color.Red));

            _timerLogs.Tick += timerLogs_Tick;
            _timerLogsRepaint.Tick += timerLogsRepaint_Tick;
        }

        public void Update()
        {
        }

        private async void timerLogs_Tick(object sender, EventArgs e)
        {
            if (_host.Controller.ConnectionState != ConnectionState.Open)
            {
                return;
            }

            var logFiles = (_host.SelectedHost.LogFiles ?? Enumerable.Empty<string>()).ToArray();
            if (!logFiles.Any())
            {
                return;
            }

            LogCommand cmd = new LogCommand();
            int[] counts = await cmd.Run(_host);

            //new string[]
            //    {
            //        "/var/local/log/BuzzStats.CrawlerService.log",
            //        "/var/local/log/BuzzStatsLog.txt"
            //    };

            for (int i = 0; i < counts.Length; i++)
            {
                _lastCount[i] = counts[i];
            }

            _lblLogs.Text =
                Enumerable.Range(0, counts.Length)
                          .Select(idx => ((LogLevel)idx).ToString() + " = " + counts[idx])
                          .Aggregate("Latest log counts: ", (a, s) => a + " " + s);
        }

        private void timerLogsRepaint_Tick(object sender, EventArgs e)
        {
            foreach (LogLevel li in Enum.GetValues(typeof(LogLevel)))
            {
                int index = (int)li;
                if (_lastCount[index].HasValue)
                {
                    _gcLogs.Series[index].Add(_lastCount[index].Value);
                }
            }

            _gcLogs.Invalidate();
        }
    }
}
