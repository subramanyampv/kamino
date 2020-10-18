using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace SshDemo
{
    public class Series
    {
        private readonly LinkedList<int> _points = new LinkedList<int>();
        private readonly Color _color;

        private double _ceil = 1.0;
        private double _floor = 1.0;

        public Series(Color color)
        {
            _color = color;
        }

        public double Ceil
        {
            get { return _ceil; }
        }

        public double Floor
        {
            get { return _floor; }
        }

        public Color Color
        {
            get { return _color; }
        }

        public void Add(int value)
        {
            _points.AddLast(value);
            if (_points.Count > GraphControl.MaxPoints)
            {
                _points.RemoveFirst();
            }

            _ceil = ClosestCeil(_points.Max());
            _floor = ClosestFloor(_points.Min());
        }

        public int[] Points()
        {
            return _points.ToArray();
        }

        private static IEnumerable<double> RoundingPoints()
        {
            for (int i = 1; i < int.MaxValue; i++)
            {
                for (int j = 1; j <= 9; j++)
                {
                    yield return j * Math.Pow(10, i);
                }
            }
        }

        private static double ClosestCeil(int val)
        {
            return RoundingPoints().First(f => f > val);
        }

        private static double ClosestFloor(int val)
        {
            double prevVal = 0.0;
            foreach (var v in RoundingPoints())
            {
                if (v >= val)
                {
                    return prevVal;
                }

                prevVal = v;
            }

            return prevVal;
        }
    }
}
