using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// General helpers.
    /// </summary>
    public static class Helpers
    {
        /// <summary>
        /// Escapes a type name.
        /// </summary>
        public static string escape(string str)
        {
            return str.Replace("`", "%60");
        }

        /// <summary>
        /// Creates an HTML link.
        /// </summary>
        public static string a(string href, string text)
        {
            return string.Format("<a href=\"{0}\">{1}</a>", escape(href), text);
        }

        /// <summary>
        /// Formats a string only when the contents are not empty.
        /// </summary>
        public static string fmt_non_empty(string template, string contents)
        {
            if (string.IsNullOrWhiteSpace(contents))
            {
                return string.Empty;
            }

            return string.Format(template, contents);
        }

        /// <summary>
        /// Formats a string only when the list is not emtpy.
        /// </summary>
        public static string fmt_non_empty(string template, IEnumerable<string> list)
        {
            return fmt_non_empty(template, string.Join("", list));
        }

        /// <summary>
        /// Keeps only the non empty elements.
        /// </summary>
        public static IEnumerable<T> filter_empty<T>(this IEnumerable<T> list)
            where T : NodeBase
        {
            return list.Where(n => !n.is_content_empty());
        }
    }
}
