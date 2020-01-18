using System.Windows.Forms;

namespace SshDemo
{
    class DfItemListViewItemSorter: ListViewItemSorter
    {
        public override int Compare(object x, object y)
        {
            DfItem a = (DfItem)((ListViewItem)x).Tag;
            DfItem b = (DfItem)((ListViewItem)y).Tag;
            int multiply = Order == SortOrder.Ascending ? 1 : -1;
            switch (SortColumn)
            {
                case 0:
                    return string.Compare(a.FileSystem, b.FileSystem) * multiply;
                case 1:
                    return a.Size.CompareTo(b.Size) * multiply;
                case 2:
                    return a.Used.CompareTo(b.Used) * multiply;
                case 3:
                    return a.Avail.CompareTo(b.Avail) * multiply;
                case 4:
                    return a.Percent.CompareTo(b.Percent) * multiply;
                case 5:
                    return string.Compare(a.MountPoint, b.MountPoint) * multiply;
                default:
                    return 0;
            }
        }
    }
}
