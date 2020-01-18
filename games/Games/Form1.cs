using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Games.T3;

namespace Games
{
    public partial class Form1 : Form
    {
        private IGame _game;
        private AIPlayer _computerPlayer = new AIPlayer();

        public Form1()
        {
            InitializeComponent();
        }

        private Size CalculateCellSize()
        {
            var width = pictureBox1.Width;
            var height = pictureBox1.Height;
            var colWidth = width / _game.ColumnCount;
            var rowHeight = height / _game.RowCount;
            return new Size(colWidth, rowHeight);
        }

        private Rectangle CalculateCellRectangle(Cell cell)
        {
            var width = pictureBox1.Width;
            var height = pictureBox1.Height;
            var colWidth = width / _game.ColumnCount;
            var rowHeight = height / _game.RowCount;
            var x = cell.Col*colWidth;
            var y = cell.Row*rowHeight;
            return new Rectangle(x, y, colWidth, rowHeight);
        }

        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            var graphics = e.Graphics;
            var width = pictureBox1.Width;
            var height = pictureBox1.Height;
            graphics.FillRectangle(Brushes.White, 0, 0, width, height);

            if (_game == null)
            {
                return;
            }

            var cellSize = CalculateCellSize();

            for (int i = 1; i < _game.RowCount; i++)
            {
                graphics.DrawLine(Pens.Black, 0, i * cellSize.Height, width, i * cellSize.Height);
            }

            for (int i = 1; i < _game.ColumnCount; i++) 
            {
                graphics.DrawLine(Pens.Black, i * cellSize.Width, 0, i * cellSize.Width, height);
            }

            var wonPath = _game.WonPath();

            foreach (Cell cell in _game.Cells().Where(c => _game[c] != BlockState.Empty))
            {
                var block = _game[cell];

                var isWinningCell = wonPath != null && wonPath.Contains(cell);
                if (isWinningCell)
                {
                    graphics.FillRectangle(Brushes.LightGoldenrodYellow, CalculateCellRectangle(cell));
                }

                graphics.TranslateTransform(cell.Col * cellSize.Width, cell.Row * cellSize.Height);

                switch (block)
                {
                    case BlockState.X:
                        graphics.DrawLine(Pens.Brown, 0, 0, cellSize.Width, cellSize.Height);
                        graphics.DrawLine(Pens.Brown, 0, cellSize.Height, cellSize.Width, 0);
                        break;
                    case BlockState.O:
                        graphics.DrawEllipse(Pens.Blue, 0, 0, cellSize.Width, cellSize.Height);
                        break;
                }

                graphics.ResetTransform();
            }
        }

        private Cell PointToCell(Point pos)
        {
            if (_game == null)
            {
                throw new InvalidOperationException();
            }

            var cellSize = CalculateCellSize();
            var col = pos.X / cellSize.Width;
            var row = pos.Y / cellSize.Height;
            return new Cell(row, col);
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {
            if (IsGameOver())
            {
                return;
            }

            if (_game.CurrentPlayer.IsHuman)
            {
                var pos = PointToClient(Cursor.Position);
                var cell = PointToCell(pos);
                if (_game.GetValidMoves().Contains(cell))
                {
                    _game.Play(cell);
                    pictureBox1.Invalidate();
                    AfterMove();
                    if (!IsGameOver())
                    {
                        backgroundWorker1.RunWorkerAsync();
                    }
                }
                else
                {
                    MessageBox.Show("You cannot play here!");
                }
            }
            else
            {
                MessageBox.Show("Wait for your turn!");
            }
        }

        private void backgroundWorker1_DoWork(object sender, DoWorkEventArgs e)
        {
            if (IsGameOver())
            {
                return;
            }

            // TODO: fix cast
            _computerPlayer.Play((Game)_game);
        }

        private void backgroundWorker1_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            pictureBox1.Invalidate();
            AfterMove();
        }

        private void AfterMove()
        {
            BlockState block = _game.Winner;
            if (block != BlockState.Empty)
            {
                MessageBox.Show(string.Format("{0} wins", block));
            }
            else
            {
                if (_game.IsBoardFull)
                {
                    MessageBox.Show("Tie!");
                }
            }
        }

        private bool IsGameOver()
        {
            return _game == null || _game.Winner != BlockState.Empty || _game.IsBoardFull;
        }

        private void timerPlayerThinking_Tick(object sender, EventArgs e)
        {
            var lbl = _game.CurrentPlayer.Block == BlockState.O ? lblTimerO : lblTimerX;
            lbl.Text = DateTime.UtcNow.Subtract(dtTimer).TotalSeconds.ToString();
        }

        private void StartGame()
        {
            dtTimer = DateTime.UtcNow;
            timerPlayerThinking.Start();
            pictureBox1.Invalidate();
            if (!_game.CurrentPlayer.IsHuman)
            {
                backgroundWorker1.RunWorkerAsync();
            }
        }

        private DateTime dtTimer;

        private void Form1_Load(object sender, EventArgs e)
        {
        }

        private void btnPlayTickTackToe_Click(object sender, EventArgs e)
        {
            _game = new Game(3, 3, new T3.WinningPaths(), new T3.ValidMoves());
            StartGame();
        }

        private void btnPlayConnectFour_Click(object sender, EventArgs e)
        {
            _game = new Game(6, 7, new C4.WinningPaths(), new C4.ValidMoves());
            StartGame();
        }

        private void btnDrawWinningPaths_Click(object sender, EventArgs e)
        {
            if (_game == null)
            {
                return;
            }

            foreach (var path in _game.GetWinningPaths())
            {
                DrawPath(path);
            }

            pictureBox1.Invalidate();
        }

        private void DrawPath(IEnumerable<Cell> path)
        {
            var g = pictureBox1.CreateGraphics();
            foreach (Cell cell in path)
            {
                var rect = CalculateCellRectangle(cell);
                g.FillRectangle(Brushes.Yellow, rect);
                Thread.Sleep(100);
            }

            g.FillRectangle(Brushes.White, 0, 0, pictureBox1.Width, pictureBox1.Height);
            Thread.Sleep(100);
        }
    }
}
