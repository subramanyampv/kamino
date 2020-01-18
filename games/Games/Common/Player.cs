using System;

namespace Games
{
    public struct Player : IEquatable<Player>
    {
        private readonly bool _isHuman;
        private readonly BlockState _block;

        public Player(bool isHuman, BlockState block)
        {
            _isHuman = isHuman;
            _block = block;
        }

        public bool IsHuman
        {
            get { return _isHuman; }
        }

        public BlockState Block
        {
            get { return _block; }
        }

        public bool Equals(Player other)
        {
            return _isHuman.Equals(other._isHuman) && _block == other._block;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            return obj is Player && Equals((Player) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (_isHuman.GetHashCode()*397) ^ (int) _block;
            }
        }

        public static bool operator ==(Player left, Player right)
        {
            return left.Equals(right);
        }

        public static bool operator !=(Player left, Player right)
        {
            return !left.Equals(right);
        }

        public override string ToString()
        {
            return string.Format("{0} ({1})", Block, IsHuman ? "human" : "A/I");
        }
    }
}