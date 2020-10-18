using System.Collections.Generic;

namespace Games
{
    public interface IGame
    {
        int RowCount { get; }
        int ColumnCount { get; }

        IEnumerable<Cell> Cells();
        BlockState this[Cell cell] { get; }
        Player CurrentPlayer { get; }
        BlockState Winner { get; }
        bool IsBoardFull { get; }
        void Play(Cell cell);
        IGame PlayInCopy(Cell cell);
        IEnumerable<IEnumerable<Cell>> GetWinningPaths();
        IEnumerable<Cell> GetValidMoves();
        IEnumerable<Cell> WonPath();
    }

    public interface IWinningPaths
    {
        IEnumerable<IEnumerable<Cell>> GetWinningPaths(IGame game);
    }

    public interface IValidMoves
    {
        IEnumerable<Cell> GetValidMoves(IGame game);
    }
}