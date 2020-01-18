using System.Data;
using System.Linq;
using System.Windows.Forms;

namespace SshDemo
{
    class DfView : IView
    {
        private readonly ListView _listView;
        private readonly IStateControllerHost _host;

        public DfView(IStateControllerHost host, ListView listView)
        {
            _listView = listView;
            _host = host;
        }

        public void OnFormLoad()
        {
            _listView.ListViewItemSorter = new DfItemListViewItemSorter();
            _listView.ColumnClick += ListViewItemSorter.ColumnClickHandler;
            _host.Controller.StateChanged += Controller_StateChanged;
        }

        private void Controller_StateChanged(object sender, StateChangedEventArgs e)
        {
            if (e.OldState == ConnectionState.Connecting && e.NewState == ConnectionState.Open)
            {
                // just opened up fresh connection!
                Update();
            }
        }

        public async void Update()
        {
            DfCommand cmd = new DfCommand();
            var dfItems = await cmd.Run(_host);
            _listView.Items.Clear();
            _listView.Items.AddRange(dfItems.Select(Create).ToArray());
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
    }
}
