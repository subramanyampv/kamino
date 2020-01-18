using System;

namespace Maze
{
    class Movement : IEquatable<Movement>
    {
        public Movement(int fromX, int fromY, Direction direction)
        {
            FromX = fromX;
            FromY = fromY;
            Direction = direction;
        }

        public int FromX { get; private set; }

        public int FromY { get; private set; }

        public Direction Direction { get; private set; }

        public int ToX
        {
            get
            {
                switch (Direction)
                {
                    case Direction.Left:
                        return FromX - 1;
                    case Direction.Right:
                        return FromX + 1;
                    default:
                        return FromX;
                }
            }
        }

        public int ToY
        {
            get
            {
                switch (Direction)
                {
                    case Direction.Top:
                        return FromY - 1;
                    case Direction.Bottom:
                        return FromY + 1;
                    default:
                        return FromY;
                }
            }
        }

        public bool Equals(Movement other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return FromX == other.FromX && FromY == other.FromY && Direction == other.Direction;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Movement)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hashCode = FromX;
                hashCode = (hashCode * 397) ^ FromY;
                hashCode = (hashCode * 397) ^ (int)Direction;
                return hashCode;
            }
        }
    }
}