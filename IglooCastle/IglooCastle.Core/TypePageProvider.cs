using System;
using System.Collections.Generic;

namespace IglooCastle.Core
{
    class TypePageProvider : IPageProvider<Type>
    {
        public IEnumerable<RenderResult> Render(Type type)
        {
            yield return new RenderResult
            {
                Filename = type.Filename(),
                Contents = "I am a type page"
            };
        }
    }
}
