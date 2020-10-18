using System.Windows.Forms;

namespace SshDemo
{
    public partial class EnterPasswordForm : Form
    {
        public EnterPasswordForm()
        {
            InitializeComponent();
        }

        public string Password
        {
            get { return txtInput.Text; }
            set { txtInput.Text = value; }
        }
    }
}
