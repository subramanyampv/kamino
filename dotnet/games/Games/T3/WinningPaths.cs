using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Games.T3
{
    class WinningPaths : IWinningPaths
    {
        public IEnumerable<IEnumerable<Cell>> GetWinningPaths(IGame game)
        {
            foreach (var x in Enumerable.Range(0, game.RowCount))
            {
                var row = x;
                yield return Enumerable.Range(0, game.ColumnCount).Select(col => new Cell(row, col));
            }

            foreach (var x in Enumerable.Range(0, game.ColumnCount))
            {
                var col = x;
                yield return Enumerable.Range(0, game.RowCount).Select(row => new Cell(row, col));
            }

            // todo assert rowcount==columncount
            yield return Enumerable.Range(0, game.RowCount).Select(i => new Cell(i, i));
            yield return Enumerable.Range(0, game.RowCount).Select(i => new Cell(i, game.RowCount - 1 - i));
        }
    }
}
