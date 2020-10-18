using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Generates page models.
    /// </summary>
    public interface IPageModelGenerator
    {
        /// <summary>
        /// Creates a <see cref="PageModel"/> for the given constructor.
        /// </summary>
        /// <param name="constructorInfo"></param>
        /// <returns></returns>
        PageModel ToPageModel(ConstructorInfo constructorInfo);
    }
}
