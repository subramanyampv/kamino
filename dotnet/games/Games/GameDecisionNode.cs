using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Games
{
    class GameDecisionNode
    {
        private readonly bool maximizing;
        private readonly int depth;

        public Cell Cell { get; private set; }

        public IGame State { get; private set; }
        public List<GameDecisionNode> Children { get; private set; }

        public GameDecisionNode(IGame game)
        {
            State = game;
            Children = new List<GameDecisionNode>();
            maximizing = true;
            depth = 0;
        }

        private GameDecisionNode(IGame state, Cell cell, bool maximizing, int depth)
        {
            State = state;
            Cell = cell;
            Children = new List<GameDecisionNode>();
            this.maximizing = maximizing;
            this.depth = depth;
        }

        public void BuildTree(int maxDepth)
        {
            if (State.Winner != BlockState.Empty || maxDepth <= 0)
            {
                return;
            }

            var q =
                from cell in State.GetValidMoves()
                let newState = State.PlayInCopy(cell)
                select new GameDecisionNode(newState, cell, !maximizing, depth + 1);

            foreach (var node in q)
            {
                Children.Add(node);
                node.BuildTree(maxDepth - 1);
            }
        }

        private NodeValue _value;
        private bool _valueCalculated;

        public NodeValue CalculateValue(Player currentPlayer)
        {
            if (_valueCalculated)
            {
                return _value;
            }

            _valueCalculated = true;
            var score = 0;
            if (Children.Any())
            {
                if (State.CurrentPlayer == currentPlayer)
                {
                    score = Children.Select(v => v.CalculateValue(currentPlayer)).Max().Score;
                }
                else
                {
                    score = Children.Select(v => v.CalculateValue(currentPlayer)).Min().Score;
                }

                _value = new NodeValue() { Score = score, ScoreSum = Children.Select(v => v.CalculateValue(currentPlayer).Score).Sum() };
            }
            else
            {
                if (State.Winner == currentPlayer.Block)
                {
                    score = 1000 - depth;
                }
                else if (State.Winner != BlockState.Empty)
                {
                    score = -(1000 - depth);
                }
                else
                {
                    score = Heuristic(currentPlayer);
                }

                _value = new NodeValue { Score = score, ScoreSum = 0 };
            }

            return _value;
        }

        private int Heuristic(Player currentPlayer)
        {
            int xScore = 0, oScore = 0;

            foreach (var path in State.GetWinningPaths())
            {
                var blocks = path.Select(cell => State[cell]).GroupBy(b => b).ToDictionary(g => g.Key, g => g.Count());
                var oBlocks = blocks.ContainsKey(BlockState.O) ? blocks[BlockState.O] : 0;
                var xBlocks = blocks.ContainsKey(BlockState.X) ? blocks[BlockState.X] : 0;
                if (oBlocks > 0 && xBlocks == 0)
                {
                    oScore += oBlocks * 2;
                }
                else if (xBlocks > 0 && oBlocks == 0)
                {
                    xScore += xBlocks * 2;
                }
            }

            return currentPlayer.Block == BlockState.O ? oScore - xScore : xScore - oScore;
        }
    }
}