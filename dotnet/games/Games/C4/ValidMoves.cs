using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Games.C4
{
    class ValidMoves : IValidMoves
    {
        public IEnumerable<Cell> GetValidMoves(IGame game)
        {
            return
                from col in Enumerable.Range(0, game.ColumnCount)
                let cell = game.Cells().Where(c => c.Col == col && game[c] == BlockState.Empty)
                    .OrderByDescending(c => c.Row)
                    .FirstOrNull()
                where cell.HasValue
                select cell.Value;
        }
    }
}
