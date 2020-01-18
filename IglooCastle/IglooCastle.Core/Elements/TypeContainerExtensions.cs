using System;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Extension methods of type container.
    /// </summary>
    public static class TypeContainerExtensions
    {
        /// <summary>
        /// Filters types based on the given predicate.
        /// </summary>
        public static ICollection<TypeElement> FilterTypes(this ITypeContainer typeContainer, Predicate<TypeElement> predicate)
        {
            return typeContainer.Types.Where(t => predicate(t)).OrderBy(t => t.Member.FullName).ToList();
        }
    }
}
