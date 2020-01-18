namespace IglooCastle.Core
{
    /// <summary>
    /// Renders HTML fragments.
    /// </summary>
    public class HtmlPage : IHtmlPage
    {
        /// <summary>
        /// Creates the HTML page for the given model.
        /// </summary>
        /// <param name="pageModel"></param>
        /// <returns></returns>
        public string CreateHtmlPage(PageModel pageModel)
        {
            return string.Format(@"<div>
<h1>{0}</h1>
<p>{1}</p>
<p><strong>Namespace:</strong> {2}</p>
<p><strong>Assembly:</strong> {3}</p>
<p><code>{4}</code></p>
</div>", pageModel.Title, pageModel.Summary, pageModel.Namespace, pageModel.Assembly, pageModel.Syntax);
        }
    }
}
