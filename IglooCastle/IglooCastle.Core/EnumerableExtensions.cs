using System;
using System.Collections.Generic;

namespace IglooCastle.Core
{
    /// <summary>
    /// Extension methods for enumerables.
    /// </summary>
    public static class EnumerableExtensions
    {
        /// <summary>
        /// Runs the given action on each element of this enumerable.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="elements"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        public static IEnumerable<T> Peek<T>(this IEnumerable<T> elements, Action<T> action)
        {
            foreach (var element in elements)
            {
                action(element);
                yield return element;
            }
        }
    }
}
