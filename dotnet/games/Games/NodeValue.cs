using System;

namespace Games
{
    struct NodeValue : IEquatable<NodeValue>, IComparable<NodeValue>
    {
        public bool Equals(NodeValue other)
        {
            if (ReferenceEquals(null, other)) return false;
            if (ReferenceEquals(this, other)) return true;
            return Score == other.Score && ScoreSum == other.ScoreSum;
        }

        public int CompareTo(NodeValue other)
        {
            if (Score == other.Score)
            {
                return ScoreSum - other.ScoreSum;
            }

            return Score - other.Score;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((NodeValue)obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (Score * 397) ^ ScoreSum;
            }
        }

        public int Score { get; set; }

        public int ScoreSum { get; set; }
    }
}