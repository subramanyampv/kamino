using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Games.C4
{
    class WinningPaths : IWinningPaths
    {
        public IEnumerable<IEnumerable<Cell>> GetWinningPaths(IGame game)
        {
            const int ContinuousBlock = 4;


            foreach (var x in Enumerable.Range(0, game.RowCount))
            {
                var row = x;
                foreach (var y in Enumerable.Range(0, game.ColumnCount - ContinuousBlock + 1))
                {
                    yield return Enumerable.Range(y, ContinuousBlock).Select(col => new Cell(row, col));
                }
            }

            foreach (var x in Enumerable.Range(0, game.ColumnCount))
            {
                var col = x;
                foreach (var y in Enumerable.Range(0, game.RowCount - ContinuousBlock + 1))
                {
                    yield return Enumerable.Range(y, ContinuousBlock).Select(row => new Cell(row, col));
                }
            }

            /*
             *  x
             *   x
             *    x
             *     x
             */     
            foreach (var x in Enumerable.Range(0, game.RowCount - ContinuousBlock + 1))
            {
               foreach (var y in Enumerable.Range(0, game.ColumnCount - ContinuousBlock + 1))
               {
                   var row = x;
                   var col = y;
                   yield return Enumerable.Range(0, ContinuousBlock).Select(i => new Cell(row + i, col + i));
               }
            }

            /*
             *     x
             *    x
             *   x 
             *  x   
             */
            foreach (var x in Enumerable.Range(0, game.RowCount - ContinuousBlock + 1))
            {
                foreach (var y in Enumerable.Range(0, game.ColumnCount - ContinuousBlock + 1))
                {
                    var row = x;
                    var col = y;
                    yield return Enumerable.Range(0, ContinuousBlock).Select(i => new Cell(game.RowCount - row - 1 - i, col + i));
                }
            }

        }
    }
}
