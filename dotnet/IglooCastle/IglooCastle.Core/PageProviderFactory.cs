using System;
using System.Collections.Generic;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Default implementation of <see cref="IPageProviderFactory" />.
    /// Creates the page providers per code element type.
    /// </summary>
    public class PageProviderFactory : IPageProviderFactory
    {
        /// <summary>
        /// Creates a collection of page providers that support constructors.
        /// </summary>
        public IEnumerable<IPageProvider<ConstructorInfo>> CreateConstructorPageProviders()
        {
            yield return new ConstructorPageProvider();
        }

        /// <summary>
        /// Creates a collection of page providers that support types.
        /// </summary>
        public IEnumerable<IPageProvider<Type>> CreateTypeProviders()
        {
            yield return new TypePageProvider();
        }
    }
}
