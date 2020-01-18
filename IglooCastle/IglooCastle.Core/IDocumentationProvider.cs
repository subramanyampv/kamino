using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Reads XML files that contain documentation of .NET code.
    /// </summary>
    public interface IDocumentationProvider
    {
        /// <summary>
        /// Gets the XML summary of the given constructor.
        /// </summary>
        /// <param name="constructorInfo"></param>
        /// <returns></returns>
        string GetSummary(ConstructorInfo constructorInfo);
    }
}
