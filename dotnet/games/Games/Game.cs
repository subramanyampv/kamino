using System.Collections.Generic;
using System.Linq;

namespace Games
{
    class Game : IGame
    {
        private readonly BlockState[,] _blocks;
        private readonly Player[] _players;
        private int _currentPlayerIndex;

        public int RowCount { get; private set; }
        public int ColumnCount { get; private set; }

        public IWinningPaths WinningPaths { get; private set; }
        public IValidMoves ValidMoves { get; private set; }

        public Game(int rowCount, int columnCount, IWinningPaths winningPaths, IValidMoves validMoves)
        {
            RowCount = rowCount;
            ColumnCount = columnCount;
            _blocks = new BlockState[RowCount, ColumnCount];
            _players = new Player[]
                {
                    new Player(true, BlockState.X),
                    new Player(false, BlockState.O)
                };
            _currentPlayerIndex = 0;
            WinningPaths = winningPaths;
            ValidMoves = validMoves;
        }

        private Game(Game other) : this(other.RowCount, other.ColumnCount, other.WinningPaths, other.ValidMoves)
        {
            foreach (Cell cell in Cells())
            {
                this[cell] = other[cell];
            }

            _currentPlayerIndex = other._currentPlayerIndex;
        }

        public IEnumerable<Cell> Cells()
        {
            return Enumerable.Range(0, RowCount).SelectMany(row => Enumerable.Range(0, ColumnCount).Select(col => new Cell(row, col)));
        }

        public BlockState this[Cell cell]
        {
            get { return _blocks[cell.Row, cell.Col]; }
            private set { _blocks[cell.Row, cell.Col] = value; }
        }

        public bool IsBoardFull
        {
            get { return _blocks.Cast<BlockState>().All(b => b != BlockState.Empty); }
        }

        public Player CurrentPlayer
        {
            get { return _players[_currentPlayerIndex]; }
        }

        private void NextPlayer()
        {
            _currentPlayerIndex = (_currentPlayerIndex + 1) % _players.Length;
        }

        public IEnumerable<IEnumerable<Cell>> GetWinningPaths()
        {
            return WinningPaths.GetWinningPaths(this);
        }

        public IEnumerable<Cell> GetValidMoves()
        {
            return ValidMoves.GetValidMoves(this);
        }

        public IEnumerable<Cell> WonPath()
        {
            var q = from path in GetWinningPaths()
                    let evaluatedPath = path.ToArray()
                    where
                        evaluatedPath.All(c => this[c] == this[evaluatedPath[0]]) &&
                        this[evaluatedPath[0]] != BlockState.Empty
                    select evaluatedPath;
            return q.FirstOrDefault();
        }

        public BlockState Winner
        {
            get
            {
                var wonPath = WonPath();
                return wonPath != null ? this[wonPath.First()] : BlockState.Empty;
            }
        }

        public void Play(Cell cell)
        {
            this[cell] = CurrentPlayer.Block;
            NextPlayer();
        }

        public IGame PlayInCopy(Cell cell)
        {
            Game result = new Game(this);
            result.Play(cell);
            return result;
        }
    }
}