using System;
using System.Linq;
using System.Windows.Forms;

namespace SshDemo
{
    public partial class HostsForm : Form
    {
        public HostsForm()
        {
            InitializeComponent();
        }

        private void btnDelete_Click(object sender, EventArgs e)
        {
            DeleteSelectedListViewItems();
            ClearEditForm();
        }

        private void ClearEditForm()
        {
            txtHost.Text = string.Empty;
            txtPassword.Text = string.Empty;
            txtPrivateKeyFile.Text = string.Empty;
            txtUsername.Text = string.Empty;
        }

        private void DeleteSelectedListViewItems()
        {
            foreach (var selectedIndex in lvHosts.SelectedIndices.Cast<int>().OrderByDescending(idx => idx))
            {
                lvHosts.Items.RemoveAt(selectedIndex);
            }
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddListViewItem();
            LoadEditForm();
        }

        private void LoadEditForm()
        {
            ListViewItem selectedItem = lvHosts.SelectedItems.Cast<ListViewItem>().FirstOrDefault();
            if (selectedItem == null)
            {
                ClearEditForm();
                return;
            }

            HostData host = (HostData)selectedItem.Tag;
            txtHost.Text = host.Host;
            txtUsername.Text = host.Username;
            txtPassword.Text = host.Password;
            txtPrivateKeyFile.Text = host.PrivateKeyFile;
            txtLogFiles.Text = string.Join(Environment.NewLine, host.LogFiles ?? Enumerable.Empty<string>());
        }

        private void AddListViewItem()
        {
            HostData host = new HostData();
            var item = lvHosts.Items.Add(new ListViewItem(new[] { "", "" }, 0) { Tag = host });
            item.Selected = true;
        }

        private void lvHosts_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadEditForm();
        }

        private void btnUpdate_Click(object sender, EventArgs e)
        {
            SaveEditForm();
        }

        private void SaveEditForm()
        {
            ListViewItem selectedItem = lvHosts.SelectedItems.Cast<ListViewItem>().FirstOrDefault();
            if (selectedItem == null)
            {
                MessageBox.Show("No item is selected", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            HostData host = (HostData)selectedItem.Tag;
            host.Host = txtHost.Text;
            host.Username = txtUsername.Text;
            host.Password = txtPassword.Text;
            host.PrivateKeyFile = txtPrivateKeyFile.Text;
            host.LogFiles = txtLogFiles.Text.Split('\r', '\n');
            selectedItem.Text = txtHost.Text;
            selectedItem.SubItems[1].Text = txtUsername.Text;
        }

        private void HostsForm_Load(object sender, EventArgs e)
        {
            LoadSettings();
        }

        private void LoadSettings()
        {
            foreach (var host in Settings.Instance.Hosts)
            {
                ListViewItem lvi = new ListViewItem(host.Host)
                    {
                        Tag = host
                    };
                lvi.SubItems.Add(host.Username);
                lvHosts.Items.Add(lvi);
            }
        }

        private void HostsForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            SaveSettings();
        }

        private void SaveSettings()
        {
            Settings.Instance.Hosts = lvHosts.Items.Cast<ListViewItem>().Select(lv => (HostData)lv.Tag).ToArray();
            Settings.Instance.Save();
        }

        private void btnBrowsePrivateKeyFile_Click(object sender, EventArgs e)
        {
            if (openFileDialog1.ShowDialog() != DialogResult.OK)
            {
                return;
            }

            txtPrivateKeyFile.Text = openFileDialog1.FileName;
        }
    }
}
