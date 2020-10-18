using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Games.T3
{
    class ValidMoves : IValidMoves
    {
        public IEnumerable<Cell> GetValidMoves(IGame game)
        {
            return game.Cells().Where(cell => game[cell] == BlockState.Empty);
        }
    }
}
