using System.Collections.Generic;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Builds constructor documentation pages.
    /// </summary>
    class ConstructorPageProvider : IPageProvider<ConstructorInfo>
    {
        /// <summary>
        /// Renders the given constructor.
        /// </summary>
        public IEnumerable<RenderResult> Render(ConstructorInfo constructorInfo)
        {
            yield return new RenderResult
            {
                Filename = constructorInfo.Filename(),
                Contents = "I am a constructor html page"
            };
        }
    }
}
