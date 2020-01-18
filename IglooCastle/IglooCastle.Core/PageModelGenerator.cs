using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Generates page models.
    /// </summary>
    public class PageModelGenerator : IPageModelGenerator
    {
        private readonly IDocumentationProvider documentationProvider;

        /// <summary>
        /// Creates an instance of the <see cref="PageModelGenerator"/> class.
        /// </summary>
        /// <param name="documentationProvider"></param>
        public PageModelGenerator(IDocumentationProvider documentationProvider)
        {
            this.documentationProvider = documentationProvider;
        }

        /// <summary>
        /// Creates a <see cref="PageModel"/> for the given constructor.
        /// </summary>
        /// <param name="constructorInfo"></param>
        /// <returns></returns>
        public PageModel ToPageModel(ConstructorInfo constructorInfo)
        {
            return new PageModel
            {
                Title = constructorInfo.DeclaringType.Name + " Constructor",
                Summary = documentationProvider.GetSummary(constructorInfo),
                Namespace = constructorInfo.DeclaringType.Namespace,
                Assembly = constructorInfo.DeclaringType.Assembly.GetName().Name,
                Syntax = (constructorInfo.IsPublic ? "public " : "") + constructorInfo.DeclaringType.Name + "()"
            };
        }
    }
}
