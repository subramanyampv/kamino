using System;
using System.Collections.Generic;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Creates the page providers per code element type.
    /// </summary>
    public interface IPageProviderFactory
    {
        /// <summary>
        /// Creates the page providers for constructors.
        /// </summary>
        IEnumerable<IPageProvider<ConstructorInfo>> CreateConstructorPageProviders();

        /// <summary>
        /// Creates a collection of page providers that support types.
        /// </summary>
        IEnumerable<IPageProvider<Type>> CreateTypeProviders();
    }
}
