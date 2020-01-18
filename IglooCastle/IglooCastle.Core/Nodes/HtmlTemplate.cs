using System.IO;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// An HTML template.
    /// </summary>
    public class HtmlTemplate
    {
        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        public string title { get; set; }

        /// <summary>
        /// Gets or sets the main header.
        /// </summary>
        public string h1 { get; set; }

        /// <summary>
        /// Gets or sets the navigation area.
        /// </summary>
        public string nav { get; set; }

        /// <summary>
        /// Gets or sets the main area.
        /// </summary>
        public string main { get; set; }

        /// <summary>
        /// Gets or sets the footer area.
        /// </summary>
        public string footer { get; set; }

        /// <summary>
        /// Writes the template to disk.
        /// </summary>
        public void write(string output_directory, string filename)
        {
            File.WriteAllText(Path.Combine(output_directory, filename), render());
        }

        /// <summary>
        /// Renders the template.
        /// </summary>
        protected virtual string render()
        {
            return string.Format(@"<html>
<head>
    <title>{0}</title>
</head>
<body>
    <!-- left side navigation -->
    <nav>
        {1}
    </nav>
    <!-- main area -->
    <section>
        <h1>{2}</h1>
        {3}
    </section>
    <!-- footer -->
    <footer>
        {4}
    </footer>
</body>
</html>
", title, nav, h1 ?? title, main, footer);
        }
    }
}
