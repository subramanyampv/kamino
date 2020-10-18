using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SshDemo
{
    public partial class DfController : Component
    {
        private StateController _stateController;
        private ListView _listView;

        public DfController()
        {
            InitializeComponent();
        }

        public DfController(IContainer container)
        {
            container.Add(this);

            InitializeComponent();
        }

        public StateController StateController
        {
            get { return _stateController; }
            set { _stateController = value; }
        }

        public ListView ListView
        {
            get { return _listView; }
            set { _listView = value; }
        }

        public async void Update()
        {
            var dfItems = await Run();
            ListView.Items.Clear();
            ListView.Items.AddRange(dfItems.Select(Create).ToArray());
        }

        private static ListViewItem Create(DfItem dfItem)
        {
            var lvItem = new ListViewItem(dfItem.FileSystem)
            {
                Tag = dfItem
            };

            lvItem.SubItems.Add(Utils.FmtKiloBytes(dfItem.Size));
            lvItem.SubItems.Add(Utils.FmtKiloBytes(dfItem.Used));
            lvItem.SubItems.Add(Utils.FmtKiloBytes(dfItem.Avail));
            lvItem.SubItems.Add(dfItem.Percent);
            lvItem.SubItems.Add(dfItem.MountPoint);
            return lvItem;
        }

        private async Task<IEnumerable<DfItem>> Run()
        {
            var cmd = await StateController.RunCommand("df");
            return Parse(cmd.Result);
        }

        private IEnumerable<DfItem> Parse(string output)
        {
            // skip header (first line)
            var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries).Skip(1);
            var p = from line in lines select line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
            return from parts in p
                   select new DfItem
                   {
                       FileSystem = parts[0],
                       Size = long.Parse(parts[1]),
                       Used = long.Parse(parts[2]),
                       Avail = long.Parse(parts[3]),
                       Percent = parts[4],
                       MountPoint = parts[5]
                   };
        }
    }
}
