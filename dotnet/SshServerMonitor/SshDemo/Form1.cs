using System;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Windows.Forms;
using Renci.SshNet.Common;

namespace SshDemo
{
    public partial class Form1 : Form, IStateControllerHost
    {
        private readonly StateController _controller = new StateController();
        private readonly DfView _dfView;
        private readonly LogView _logView;

        public Form1()
        {
            InitializeComponent();
            _dfView = new DfView(this, lvDF);
            _logView = new LogView(this, gcLogs, lblLogs, timerLogs, timerLogsRepaint);
        }

        public StateController Controller
        {
            get { return _controller; }
        }

        public HostData SelectedHost
        {
            get
            {
                int selectedHostIndex = cbHosts.SelectedIndex;
                if (selectedHostIndex < 0)
                {
                    return null;
                }

                return Settings.Instance.Hosts[selectedHostIndex];
            }
        }

        private void PopulateHostsComboBox()
        {
            cbHosts.Items.Clear();
            cbHosts.Items.AddRange(Settings.Instance.Hosts.Select(h => h.Host).ToArray());
        }

        private void InitSettings()
        {
            try
            {
                Settings.Instance = Settings.Load();
            }
            catch
            {
                Settings.Instance = new Settings();
                MessageBox.Show("Error loading settings");
            }
        }

        private void Connect(string password)
        {
            var host = SelectedHost;
            if (host == null)
            {
                MessageBox.Show("No host selected", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _controller.Connect(host, password);
        }

        #region non UI events

        private void Form1_Load(object sender, EventArgs e)
        {
            InitSettings();
            PopulateHostsComboBox();

            _controller.StateChanged += StateController_StateChanged;
            _controller.ErrorOccurred += StateController_ErrorOccurred;

            _dfView.OnFormLoad();
            _logView.OnFormLoad();
        }

        void StateController_ErrorOccurred(object sender, RunWorkerCompletedEventArgs e)
        {
            lblLastError.Text = e.Error.Message;
            MessageBox.Show("Error: " + e.Error.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            if (e.Error is SshPassPhraseNullOrEmptyException)
            {
                EnterPasswordForm form = new EnterPasswordForm();
                if (form.ShowDialog(this) == DialogResult.OK)
                {
                    Connect(form.Password);
                }
            }
        }

        void StateController_StateChanged(object sender, StateChangedEventArgs e)
        {
            lblState.Text = e.NewState.ToString();
            lblLastError.Text = string.Empty;
            btnConnect.Enabled = e.NewState == ConnectionState.Closed;
            btnDisconnect.Enabled = e.NewState == ConnectionState.Open;
        }

        #endregion

        #region UI event handlers for buttons and menu items

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void hostsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            HostsForm dialog = new HostsForm();
            dialog.ShowDialog(this);
            PopulateHostsComboBox();
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            Connect(null);
        }

        private void btnDisconnect_Click(object sender, EventArgs e)
        {
            _controller.Disconnect();
        }

        #endregion
    }
}
