namespace IglooCastle.Core
{
    /// <summary>
    /// Renders HTML pages.
    /// </summary>
    public interface IHtmlPage
    {
        /// <summary>
        /// Creates the HTML page for the given model.
        /// </summary>
        /// <param name="pageModel"></param>
        /// <returns></returns>
        string CreateHtmlPage(PageModel pageModel);
    }
}
