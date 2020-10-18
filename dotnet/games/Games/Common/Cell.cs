using System;

namespace Games
{
    public struct Cell : IEquatable<Cell>
    {
        private readonly int _row;
        private readonly int _col;

        public Cell(int row, int col)
        {
            _row = row;
            _col = col;
        }

        public int Row { get { return _row; } }

        public int Col { get { return _col; } }

        public bool Equals(Cell other)
        {
            return _row == other._row && _col == other._col;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            return obj is Cell && Equals((Cell) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (_row*397) ^ _col;
            }
        }

        public static bool operator ==(Cell left, Cell right)
        {
            return left.Equals(right);
        }

        public static bool operator !=(Cell left, Cell right)
        {
            return !left.Equals(right);
        }

        public override string ToString()
        {
            return string.Format("{0}-{1}", Row, Col);
        }
    }
}