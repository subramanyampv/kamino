namespace SshDemo
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.lvDF = new System.Windows.Forms.ListView();
            this.columnHeader1 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader2 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader3 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader4 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader5 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader6 = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.editToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.hostsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.cbHosts = new System.Windows.Forms.ToolStripComboBox();
            this.btnConnect = new System.Windows.Forms.ToolStripButton();
            this.btnDisconnect = new System.Windows.Forms.ToolStripButton();
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabDiskUsage = new System.Windows.Forms.TabPage();
            this.tabUsersGroups = new System.Windows.Forms.TabPage();
            this.tabZFS = new System.Windows.Forms.TabPage();
            this.tabMemory = new System.Windows.Forms.TabPage();
            this.tabLogs = new System.Windows.Forms.TabPage();
            this.lblLogs = new System.Windows.Forms.Label();
            this.gcLogs = new SshDemo.GraphControl();
            this.stateController1 = new SshDemo.StateController(this.components);
            this.timerLogs = new System.Windows.Forms.Timer(this.components);
            this.timerLogsRepaint = new System.Windows.Forms.Timer(this.components);
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.lblState = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblLastError = new System.Windows.Forms.ToolStripStatusLabel();
            this.dfController1 = new SshDemo.DfController(this.components);
            this.menuStrip1.SuspendLayout();
            this.toolStrip1.SuspendLayout();
            this.tabControl1.SuspendLayout();
            this.tabDiskUsage.SuspendLayout();
            this.tabLogs.SuspendLayout();
            this.statusStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // textBox1
            // 
            this.textBox1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.textBox1.Location = new System.Drawing.Point(9, 323);
            this.textBox1.Margin = new System.Windows.Forms.Padding(2);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(544, 36);
            this.textBox1.TabIndex = 1;
            // 
            // lvDF
            // 
            this.lvDF.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader3,
            this.columnHeader4,
            this.columnHeader5,
            this.columnHeader6});
            this.lvDF.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvDF.Location = new System.Drawing.Point(2, 2);
            this.lvDF.Margin = new System.Windows.Forms.Padding(2);
            this.lvDF.Name = "lvDF";
            this.lvDF.Size = new System.Drawing.Size(531, 233);
            this.lvDF.TabIndex = 3;
            this.lvDF.UseCompatibleStateImageBehavior = false;
            this.lvDF.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader1
            // 
            this.columnHeader1.Text = "File System";
            // 
            // columnHeader2
            // 
            this.columnHeader2.Text = "Size";
            // 
            // columnHeader3
            // 
            this.columnHeader3.Text = "Used";
            // 
            // columnHeader4
            // 
            this.columnHeader4.Text = "Avail";
            // 
            // columnHeader5
            // 
            this.columnHeader5.Text = "Use %";
            // 
            // columnHeader6
            // 
            this.columnHeader6.Text = "Mounted on";
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.editToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Padding = new System.Windows.Forms.Padding(4, 2, 0, 2);
            this.menuStrip1.Size = new System.Drawing.Size(561, 24);
            this.menuStrip1.TabIndex = 6;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.exitToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
            this.fileToolStripMenuItem.Text = "&File";
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Alt | System.Windows.Forms.Keys.X)));
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(129, 22);
            this.exitToolStripMenuItem.Text = "E&xit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // editToolStripMenuItem
            // 
            this.editToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.hostsToolStripMenuItem});
            this.editToolStripMenuItem.Name = "editToolStripMenuItem";
            this.editToolStripMenuItem.Size = new System.Drawing.Size(39, 20);
            this.editToolStripMenuItem.Text = "&Edit";
            // 
            // hostsToolStripMenuItem
            // 
            this.hostsToolStripMenuItem.Name = "hostsToolStripMenuItem";
            this.hostsToolStripMenuItem.ShortcutKeys = ((System.Windows.Forms.Keys)((System.Windows.Forms.Keys.Control | System.Windows.Forms.Keys.H)));
            this.hostsToolStripMenuItem.Size = new System.Drawing.Size(156, 22);
            this.hostsToolStripMenuItem.Text = "&Hosts...";
            this.hostsToolStripMenuItem.Click += new System.EventHandler(this.hostsToolStripMenuItem_Click);
            // 
            // toolStrip1
            // 
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.cbHosts,
            this.btnConnect,
            this.btnDisconnect});
            this.toolStrip1.Location = new System.Drawing.Point(0, 24);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(561, 25);
            this.toolStrip1.TabIndex = 7;
            this.toolStrip1.Text = "toolStrip1";
            // 
            // cbHosts
            // 
            this.cbHosts.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cbHosts.Name = "cbHosts";
            this.cbHosts.Size = new System.Drawing.Size(92, 25);
            // 
            // btnConnect
            // 
            this.btnConnect.Image = ((System.Drawing.Image)(resources.GetObject("btnConnect.Image")));
            this.btnConnect.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(72, 22);
            this.btnConnect.Text = "Connect";
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // btnDisconnect
            // 
            this.btnDisconnect.Enabled = false;
            this.btnDisconnect.Image = ((System.Drawing.Image)(resources.GetObject("btnDisconnect.Image")));
            this.btnDisconnect.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnDisconnect.Name = "btnDisconnect";
            this.btnDisconnect.Size = new System.Drawing.Size(86, 22);
            this.btnDisconnect.Text = "Disconnect";
            this.btnDisconnect.Click += new System.EventHandler(this.btnDisconnect_Click);
            // 
            // tabControl1
            // 
            this.tabControl1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tabControl1.Controls.Add(this.tabDiskUsage);
            this.tabControl1.Controls.Add(this.tabUsersGroups);
            this.tabControl1.Controls.Add(this.tabZFS);
            this.tabControl1.Controls.Add(this.tabMemory);
            this.tabControl1.Controls.Add(this.tabLogs);
            this.tabControl1.Location = new System.Drawing.Point(9, 56);
            this.tabControl1.Margin = new System.Windows.Forms.Padding(2);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(543, 263);
            this.tabControl1.TabIndex = 8;
            // 
            // tabDiskUsage
            // 
            this.tabDiskUsage.Controls.Add(this.lvDF);
            this.tabDiskUsage.Location = new System.Drawing.Point(4, 22);
            this.tabDiskUsage.Margin = new System.Windows.Forms.Padding(2);
            this.tabDiskUsage.Name = "tabDiskUsage";
            this.tabDiskUsage.Padding = new System.Windows.Forms.Padding(2);
            this.tabDiskUsage.Size = new System.Drawing.Size(535, 237);
            this.tabDiskUsage.TabIndex = 0;
            this.tabDiskUsage.Text = "Disk Usage";
            this.tabDiskUsage.UseVisualStyleBackColor = true;
            // 
            // tabUsersGroups
            // 
            this.tabUsersGroups.Location = new System.Drawing.Point(4, 22);
            this.tabUsersGroups.Margin = new System.Windows.Forms.Padding(2);
            this.tabUsersGroups.Name = "tabUsersGroups";
            this.tabUsersGroups.Padding = new System.Windows.Forms.Padding(2);
            this.tabUsersGroups.Size = new System.Drawing.Size(535, 237);
            this.tabUsersGroups.TabIndex = 1;
            this.tabUsersGroups.Text = "Users and Groups";
            this.tabUsersGroups.UseVisualStyleBackColor = true;
            // 
            // tabZFS
            // 
            this.tabZFS.Location = new System.Drawing.Point(4, 22);
            this.tabZFS.Margin = new System.Windows.Forms.Padding(2);
            this.tabZFS.Name = "tabZFS";
            this.tabZFS.Size = new System.Drawing.Size(535, 237);
            this.tabZFS.TabIndex = 2;
            this.tabZFS.Text = "ZFS";
            this.tabZFS.UseVisualStyleBackColor = true;
            // 
            // tabMemory
            // 
            this.tabMemory.Location = new System.Drawing.Point(4, 22);
            this.tabMemory.Margin = new System.Windows.Forms.Padding(2);
            this.tabMemory.Name = "tabMemory";
            this.tabMemory.Size = new System.Drawing.Size(535, 237);
            this.tabMemory.TabIndex = 3;
            this.tabMemory.Text = "Memory";
            this.tabMemory.UseVisualStyleBackColor = true;
            // 
            // tabLogs
            // 
            this.tabLogs.Controls.Add(this.lblLogs);
            this.tabLogs.Controls.Add(this.gcLogs);
            this.tabLogs.Location = new System.Drawing.Point(4, 22);
            this.tabLogs.Name = "tabLogs";
            this.tabLogs.Padding = new System.Windows.Forms.Padding(3);
            this.tabLogs.Size = new System.Drawing.Size(535, 237);
            this.tabLogs.TabIndex = 4;
            this.tabLogs.Text = "Log monitoring";
            this.tabLogs.UseVisualStyleBackColor = true;
            // 
            // lblLogs
            // 
            this.lblLogs.AutoSize = true;
            this.lblLogs.Location = new System.Drawing.Point(7, 7);
            this.lblLogs.Name = "lblLogs";
            this.lblLogs.Size = new System.Drawing.Size(91, 13);
            this.lblLogs.TabIndex = 1;
            this.lblLogs.Text = "Latest log counts:";
            // 
            // gcLogs
            // 
            this.gcLogs.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.gcLogs.Location = new System.Drawing.Point(6, 39);
            this.gcLogs.Name = "gcLogs";
            this.gcLogs.Size = new System.Drawing.Size(523, 157);
            this.gcLogs.StateController = this.stateController1;
            this.gcLogs.TabIndex = 0;
            // 
            // timerLogs
            // 
            this.timerLogs.Interval = 2000;
            // 
            // timerLogsRepaint
            // 
            this.timerLogsRepaint.Interval = 250;
            // 
            // statusStrip1
            // 
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblState,
            this.lblLastError});
            this.statusStrip1.Location = new System.Drawing.Point(0, 371);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.Size = new System.Drawing.Size(561, 22);
            this.statusStrip1.TabIndex = 9;
            this.statusStrip1.Text = "statusStrip1";
            // 
            // lblState
            // 
            this.lblState.Name = "lblState";
            this.lblState.Size = new System.Drawing.Size(79, 17);
            this.lblState.Text = "Disconnected";
            // 
            // lblLastError
            // 
            this.lblLastError.Name = "lblLastError";
            this.lblLastError.Size = new System.Drawing.Size(0, 17);
            // 
            // dfController1
            // 
            this.dfController1.ListView = this.lvDF;
            this.dfController1.StateController = this.stateController1;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(561, 393);
            this.Controls.Add(this.statusStrip1);
            this.Controls.Add(this.tabControl1);
            this.Controls.Add(this.toolStrip1);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.menuStrip1);
            this.MainMenuStrip = this.menuStrip1;
            this.Margin = new System.Windows.Forms.Padding(2);
            this.Name = "Form1";
            this.Text = "Server Monitor";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.tabControl1.ResumeLayout(false);
            this.tabDiskUsage.ResumeLayout(false);
            this.tabLogs.ResumeLayout(false);
            this.tabLogs.PerformLayout();
            this.statusStrip1.ResumeLayout(false);
            this.statusStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.ListView lvDF;
        private System.Windows.Forms.ColumnHeader columnHeader1;
        private System.Windows.Forms.ColumnHeader columnHeader2;
        private System.Windows.Forms.ColumnHeader columnHeader3;
        private System.Windows.Forms.ColumnHeader columnHeader4;
        private System.Windows.Forms.ColumnHeader columnHeader5;
        private System.Windows.Forms.ColumnHeader columnHeader6;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem editToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem hostsToolStripMenuItem;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripComboBox cbHosts;
        private System.Windows.Forms.ToolStripButton btnConnect;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabDiskUsage;
        private System.Windows.Forms.TabPage tabUsersGroups;
        private System.Windows.Forms.TabPage tabZFS;
        private System.Windows.Forms.TabPage tabMemory;
        private System.Windows.Forms.TabPage tabLogs;
        private System.Windows.Forms.Timer timerLogs;
        private System.Windows.Forms.Timer timerLogsRepaint;
        private GraphControl gcLogs;
        private System.Windows.Forms.Label lblLogs;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.ToolStripStatusLabel lblState;
        private System.Windows.Forms.ToolStripStatusLabel lblLastError;
        private System.Windows.Forms.ToolStripButton btnDisconnect;
        private StateController stateController1;
        private DfController dfController1;
    }
}

