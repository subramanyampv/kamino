using System.Collections;
using System.Windows.Forms;

namespace SshDemo
{
    /// <summary>
    /// Base class for a list view comparator that keeps track of the sorting column and sorting order.
    /// </summary>
    abstract class ListViewItemSorter : IComparer
    {
        protected ListViewItemSorter()
        {
            SortColumn = -1;
        }

        public int SortColumn { get; set; }
        public SortOrder Order { get; set; }
        public abstract int Compare(object x, object y);

        public static void ColumnClickHandler(object sender, ColumnClickEventArgs e)
        {
            ListView listView = (ListView)sender;
            ListViewItemSorter lvwColumnSorter = (ListViewItemSorter)listView.ListViewItemSorter;

            // Determine if clicked column is already the column that is being sorted.
            if (e.Column == lvwColumnSorter.SortColumn)
            {
                // Reverse the current sort direction for this column.
                if (lvwColumnSorter.Order == SortOrder.Ascending)
                {
                    lvwColumnSorter.Order = SortOrder.Descending;
                }
                else
                {
                    lvwColumnSorter.Order = SortOrder.Ascending;
                }
            }
            else
            {
                // Set the column number that is to be sorted; default to ascending.
                lvwColumnSorter.SortColumn = e.Column;
                lvwColumnSorter.Order = SortOrder.Ascending;
            }

            // Perform the sort with these new sort options.
            listView.Sort();
        }
    }
}
