using System;
using System.Collections.Generic;
using System.Linq;

namespace Games
{
    public static class EnumerableExtensions
    {
        public static T Random<T>(this IEnumerable<T> sequence)
        {
            var tmp = sequence.ToArray();
            return tmp[new Random().Next(tmp.Length)];
        }

        public static T? FirstOrNull<T>(this IEnumerable<T> sequence) where T : struct
        {
            foreach (T val in sequence)
            {
                return val;
            }

            return null;
        }
    }
}