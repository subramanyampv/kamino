using System;

namespace Maze
{
    enum Direction
    {
        Right,
        Bottom,
        Left,
        Top
    }

    static class DirectionExtensions
    {
        public static Direction Reverse(this Direction direction)
        {
            switch (direction)
            {
                case Direction.Bottom:
                    return Direction.Top;
                case Direction.Left:
                    return Direction.Right;
                case Direction.Right:
                    return Direction.Left;
                case Direction.Top:
                    return Direction.Bottom;
                default:
                    throw new NotSupportedException();
            }
        }
    }
}