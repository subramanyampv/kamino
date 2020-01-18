using System.Collections.Generic;

namespace IglooCastle.Core
{
    /// <summary>
    /// Provides documentation pages for a type of code element (like methods, properties, etc).
    /// </summary>
    public interface IPageProvider<T>
    {
        /// <summary>
        /// Creates a collection of pages for the given element.
        /// </summary>
        IEnumerable<RenderResult> Render(T element);
    }
}
