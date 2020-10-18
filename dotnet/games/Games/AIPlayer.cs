using System;
using System.Linq;

namespace Games
{
    class AIPlayer
    {
        public void Play(Game game)
        {
            if (game.IsBoardFull)
            {
                throw new InvalidOperationException("Board is full");
            }

            GameDecisionNode decision = new GameDecisionNode(game);
            decision.BuildTree(maxDepth: 3);

            var move = decision.Children.OrderByDescending(c => c.CalculateValue(game.CurrentPlayer)).FirstOrDefault();
            if (move != null)
            {
                //var value = move.Value;
                //move = decision.Children.Where(v => v.Value == value).Random();

                game.Play(move.Cell);
            }
            else
            {
                PickRandomMove(game);
            }
        }

        private void PickRandomMove(Game game)
        {
            var rnd = new Random();
            var cell = game.Cells().Where(c => game[c] == BlockState.Empty).Random();
            game.Play(cell);
        }
    }
}