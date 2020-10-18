namespace Games
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
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.backgroundWorker1 = new System.ComponentModel.BackgroundWorker();
            this.lblTimerX = new System.Windows.Forms.Label();
            this.lblTimerO = new System.Windows.Forms.Label();
            this.timerPlayerThinking = new System.Windows.Forms.Timer(this.components);
            this.toolStrip1 = new System.Windows.Forms.ToolStrip();
            this.btnPlayTickTackToe = new System.Windows.Forms.ToolStripButton();
            this.btnPlayConnectFour = new System.Windows.Forms.ToolStripButton();
            this.btnDrawWinningPaths = new System.Windows.Forms.ToolStripButton();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.toolStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // pictureBox1
            // 
            this.pictureBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pictureBox1.Location = new System.Drawing.Point(12, 28);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(473, 450);
            this.pictureBox1.TabIndex = 0;
            this.pictureBox1.TabStop = false;
            this.pictureBox1.Click += new System.EventHandler(this.pictureBox1_Click);
            this.pictureBox1.Paint += new System.Windows.Forms.PaintEventHandler(this.pictureBox1_Paint);
            // 
            // backgroundWorker1
            // 
            this.backgroundWorker1.DoWork += new System.ComponentModel.DoWorkEventHandler(this.backgroundWorker1_DoWork);
            this.backgroundWorker1.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(this.backgroundWorker1_RunWorkerCompleted);
            // 
            // lblTimerX
            // 
            this.lblTimerX.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.lblTimerX.AutoSize = true;
            this.lblTimerX.Location = new System.Drawing.Point(12, 481);
            this.lblTimerX.Name = "lblTimerX";
            this.lblTimerX.Size = new System.Drawing.Size(34, 13);
            this.lblTimerX.TabIndex = 1;
            this.lblTimerX.Text = "00:00";
            // 
            // lblTimerO
            // 
            this.lblTimerO.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.lblTimerO.AutoSize = true;
            this.lblTimerO.Location = new System.Drawing.Point(451, 481);
            this.lblTimerO.Name = "lblTimerO";
            this.lblTimerO.Size = new System.Drawing.Size(34, 13);
            this.lblTimerO.TabIndex = 2;
            this.lblTimerO.Text = "00:00";
            // 
            // timerPlayerThinking
            // 
            this.timerPlayerThinking.Tick += new System.EventHandler(this.timerPlayerThinking_Tick);
            // 
            // toolStrip1
            // 
            this.toolStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.btnPlayTickTackToe,
            this.btnPlayConnectFour,
            this.btnDrawWinningPaths});
            this.toolStrip1.Location = new System.Drawing.Point(0, 0);
            this.toolStrip1.Name = "toolStrip1";
            this.toolStrip1.Size = new System.Drawing.Size(497, 25);
            this.toolStrip1.TabIndex = 3;
            this.toolStrip1.Text = "toolStrip1";
            // 
            // btnPlayTickTackToe
            // 
            this.btnPlayTickTackToe.Image = ((System.Drawing.Image)(resources.GetObject("btnPlayTickTackToe.Image")));
            this.btnPlayTickTackToe.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnPlayTickTackToe.Name = "btnPlayTickTackToe";
            this.btnPlayTickTackToe.Size = new System.Drawing.Size(125, 22);
            this.btnPlayTickTackToe.Text = "Play Tick Tack Toe";
            this.btnPlayTickTackToe.Click += new System.EventHandler(this.btnPlayTickTackToe_Click);
            // 
            // btnPlayConnectFour
            // 
            this.btnPlayConnectFour.Image = ((System.Drawing.Image)(resources.GetObject("btnPlayConnectFour.Image")));
            this.btnPlayConnectFour.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnPlayConnectFour.Name = "btnPlayConnectFour";
            this.btnPlayConnectFour.Size = new System.Drawing.Size(124, 22);
            this.btnPlayConnectFour.Text = "Play Connect Four";
            this.btnPlayConnectFour.Click += new System.EventHandler(this.btnPlayConnectFour_Click);
            // 
            // btnDrawWinningPaths
            // 
            this.btnDrawWinningPaths.Image = ((System.Drawing.Image)(resources.GetObject("btnDrawWinningPaths.Image")));
            this.btnDrawWinningPaths.ImageTransparentColor = System.Drawing.Color.Magenta;
            this.btnDrawWinningPaths.Name = "btnDrawWinningPaths";
            this.btnDrawWinningPaths.Size = new System.Drawing.Size(132, 22);
            this.btnDrawWinningPaths.Text = "Draw winning paths";
            this.btnDrawWinningPaths.Click += new System.EventHandler(this.btnDrawWinningPaths_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(497, 503);
            this.Controls.Add(this.toolStrip1);
            this.Controls.Add(this.lblTimerO);
            this.Controls.Add(this.lblTimerX);
            this.Controls.Add(this.pictureBox1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.toolStrip1.ResumeLayout(false);
            this.toolStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.PictureBox pictureBox1;
        private System.ComponentModel.BackgroundWorker backgroundWorker1;
        private System.Windows.Forms.Label lblTimerX;
        private System.Windows.Forms.Label lblTimerO;
        private System.Windows.Forms.Timer timerPlayerThinking;
        private System.Windows.Forms.ToolStrip toolStrip1;
        private System.Windows.Forms.ToolStripButton btnPlayTickTackToe;
        private System.Windows.Forms.ToolStripButton btnPlayConnectFour;
        private System.Windows.Forms.ToolStripButton btnDrawWinningPaths;
    }
}

