using IglooCastle.Core.Nodes;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Collects classes and builds documentation.
    /// </summary>
    public class DocumentationBuilder
    {
        private readonly IHtmlPage htmlPage;
        private readonly IPageModelGenerator pageModelGenerator;

        /// <summary>
        /// Creates an instance of the <see cref="DocumentationBuilder"/> class.
        /// </summary>
        /// <param name="htmlPage">The html page writer</param>
        /// <param name="pageModelGenerator">The page model generator</param>
        public DocumentationBuilder(IHtmlPage htmlPage, IPageModelGenerator pageModelGenerator)
        {
            this.htmlPage = htmlPage;
            this.pageModelGenerator = pageModelGenerator;
        }
        
        /// <summary>
        /// Builds documentation for the given elements.
        /// </summary>
        /// <param name="elements"></param>
        /// <returns></returns>
        public IEnumerable<FileDefinition> Build(IEnumerable<MemberInfo> elements)
        {
            return elements.Select(ToFileDefinition);
        }

        private FileDefinition ToFileDefinition(MemberInfo element)
        {
            NavigationNode navigationNode = new NavigationNode(element);
            return new FileDefinition(navigationNode.GetFilename(), GetContents(element));
        }

        private string GetContents(MemberInfo element)
        {
            ConstructorInfo constructorInfo = element as ConstructorInfo;
            return htmlPage.CreateHtmlPage(pageModelGenerator.ToPageModel(constructorInfo));
        }
    }
}
