using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Games;

namespace Maze
{
    public partial class Form1 : Form
    {


        private const string Map = @"
 ---------
         -
----  ----
-        -
------- --
-----    -
-        -
- --------
-         
";

        private Point actor;
        private Size blockSize;
        private int Rows { get; set; }
        private int Columns { get; set; }
        private BlockType[][] blocks;

        public Form1()
        {
            blocks = Map.Split('\r', '\n').Where(s => s.Trim().Length > 0)
                .Select(s => s.ToCharArray().Select(ch => ch == ' ' ? BlockType.Land : BlockType.Wall).ToArray())
                .ToArray();
            InitializeComponent();
        }

        class Node
        {
            public Cell Cell;
            public Node Previous;

            public Node(Cell cell)
            {
                this.Cell = cell;
                this.Previous = null;
            }
        }

       

        // http://gabrielgambetta.com/path1.html

        private class PathFinder
        {
            private List<Node> reachable;
            private List<Node> explored;
            private Cell start;
            private Cell destination;
            private BlockType[][] blocks;

            public PathFinder(Cell start, Cell destination, BlockType[][] blocks)
            {
                reachable = new List<Node> {new Node(start)};
                explored = new List<Node>();
                this.start = start;
                this.destination = destination;
                this.blocks = blocks;
            }

            private Node ChooseNode(IEnumerable<Node> nodes)
            {
                return nodes.First();
            }

            private bool IsInBound(Cell cell)
            {
                return cell.Col >= 0 && cell.Row >= 0 && cell.Col < blocks[0].Length && cell.Row < blocks.Length;
            }

            private bool IsLand(Cell cell)
            {
                return blocks[cell.Row][cell.Col] == BlockType.Land;
            }

            private IEnumerable<Node> GetAdjacentNodes(Node node)
            {
                var cell = node.Cell;
                var x = cell.Col;
                var y = cell.Row;

                var cells = new[]
                    {
                        new Cell(y - 1, x),
                        new Cell(y + 1, x),
                        new Cell(y, x - 1),
                        new Cell(y, x + 1)
                    };

                return cells.Where(IsInBound).Where(IsLand).Select(_ => new Node(_));
            }

            public void Step()
            {

                if (reachable.Any())
                {
                    Node node = ChooseNode(reachable);

                    if (node.Cell == destination)
                    {
                        // build_path
                        throw new NotImplementedException();
                        return;
                    }

                    reachable.Remove(node);
                    explored.Add(node);

                    var newReachable = GetAdjacentNodes(node).Except(explored);
                    foreach (var adjacent in newReachable)
                    {
                        if (!reachable.Contains(adjacent))
                        {
                            adjacent.Previous = node;
                            reachable.Add(adjacent);
                        }
                    }
                }

                throw new InvalidOperationException("Path not found!");
            }

            private Cell[] BuildPath(Node toNode)
            {
                var path = new List<Cell>();
                for (Node n = toNode; n != null; n = n.Previous)
                {
                    path.Add(n.Cell);
                }

                return path.ToArray();
            }
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void pictureBox1_Paint(object sender, PaintEventArgs e)
        {
            var graphics = e.Graphics;
            graphics.FillRectangle(Brushes.FloralWhite, pictureBox1.ClientRectangle);
            DrawMap(graphics);
        }

        private void DrawMap(Graphics graphics)
        {
            CalculateBlockSize();

            for (int i = 0; i < blocks.Length; i++)
            {
                BlockType[] row = blocks[i];
                for (int j = 0; j < row.Length; j++)
                {
                    BlockType cell = row[j];
                    graphics.FillRectangle(cell == BlockType.Wall ? Brushes.Firebrick : Brushes.FloralWhite, j * blockSize.Width, i * blockSize.Height, blockSize.Width, blockSize.Height);
                }
            }

            DrawActor(graphics);
        }

        private void CalculateBlockSize()
        {
            Rows = blocks.Length;
            blockSize.Height = pictureBox1.Height / Rows;
            Columns = blocks[0].Length;
            blockSize.Width = pictureBox1.Width / Columns;
        }

        private void DrawActor(Graphics graphics)
        {
            graphics.FillEllipse(Brushes.DeepSkyBlue, actor.X * blockSize.Width, actor.Y * blockSize.Height, blockSize.Width, blockSize.Height);
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            //MoveActor();
            pathFinder.Step();
        }

        private List<Movement> pastMovements = new List<Movement>();
        private Stack<Movement> movementQueue = new Stack<Movement>();
        private PathFinder pathFinder;

        private void MoveActor()
        {
            Movement right = new Movement(actor.X, actor.Y, Direction.Right),
                bottom = new Movement(actor.X, actor.Y, Direction.Bottom),
                left = new Movement(actor.X, actor.Y, Direction.Left),
                top = new Movement(actor.X, actor.Y, Direction.Top);

            var movements = new[] { right, bottom, left, top };

            // ordering to favor movements closer to destination
            var validMovements = movements.OrderByDescending(m => m.ToX*m.ToX + m.ToY*m.ToY).Where(IsValidMove).ToArray();

            var firstValidMovement = validMovements.FirstOrDefault(m => !IsVisited(m)) ??
                                     validMovements.FirstOrDefault(m => !pastMovements.Contains(m));

            if (firstValidMovement != null)
            {
                statusLabel.Text = "Found valid movement, going " + firstValidMovement.Direction;
                Go(firstValidMovement);
                return;
            }

            if (movementQueue.Count > 0)
            {
                Movement lastMove = movementQueue.Pop();
                Movement goBack = new Movement(actor.X, actor.Y, lastMove.Direction.Reverse());
                if (!pastMovements.Contains(goBack))
                {
                    statusLabel.Text = "Going back!";
                    Go(goBack);
                }
                else
                {
                    GameOver();
                }
            }
        }

        private bool IsVisited(Movement probableMovement)
        {
            return pastMovements.Any(m => m.ToX == probableMovement.ToX && m.ToY == probableMovement.ToY);
        }

        private void GameOver()
        {
            timer1.Enabled = false;
            btnStart.Enabled = false;
        }

        private bool IsValidMove(Movement m)
        {
            var newX = m.ToX;
            var newY = m.ToY;

            if (newX < 0 || newX >= Columns || newY < 0 || newY >= Rows)
            {
                return false;
            }

            if (blocks[newY][newX] == BlockType.Wall)
            {
                return false;
            }

            return true;
        }

        private void Go(Movement m)
        {
            actor.X = m.ToX;
            actor.Y = m.ToY;
            pictureBox1.Invalidate();
            pastMovements.Add(m);
            movementQueue.Push(m);

            if (actor.X == Columns - 1 && actor.Y == Rows - 1)
            {
                GameOver();
            }
        }

        private void btnStart_Click(object sender, EventArgs e)
        {
            if (pathFinder == null)
            {
                pathFinder = new PathFinder(new Cell(0,0), new Cell(blocks.Length, blocks[0].Length), blocks);
            }

            timer1.Enabled = !timer1.Enabled;
            btnStart.Text = timer1.Enabled ? "Stop" : "Start";
        }
    }
}
