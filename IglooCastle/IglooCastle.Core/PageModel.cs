using System;
using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Core
{
    /// <summary>
    /// Defines the information available on a page.
    /// </summary>
    public class PageModel : IEquatable<PageModel>
    {
        private List<string> seeAlso = new List<string>();

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the summary.
        /// </summary>
        public string Summary { get; set; }

        /// <summary>
        /// Gets or sets the namespace.
        /// </summary>
        public string Namespace { get; set; }

        /// <summary>
        /// Gets or sets the assembly.
        /// </summary>
        public string Assembly { get; set; }

        /// <summary>
        /// Gets or sets the syntax.
        /// </summary>
        public string Syntax { get; set; }

        /// <summary>
        /// Gets or sets the see also links.
        /// </summary>
        public ICollection<string> SeeAlso
        {
            get
            {
                return seeAlso.ToArray();
            }

            set
            {
                seeAlso = new List<string>(value ?? Enumerable.Empty<string>());
            }
        }

        /// <summary>
        /// Creates a string representation of this object.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return string.Format(
                "PageModel(Title: {0}, Summary: {1}, Namespace: {2}, Assembly: {3}, Syntax: {4}, SeeAlso: [{5}])",
                Title,
                Summary,
                Namespace,
                Assembly,
                Syntax,
                string.Join(", ", SeeAlso));
        }

        /// <summary>
        /// Checks if this object is equal to another one.
        /// </summary>
        /// <param name="other"></param>
        /// <returns></returns>
        public bool Equals(PageModel other)
        {
            if (other == null)
            {
                return false;
            }

            return string.Equals(Title, other.Title) &&
                string.Equals(Summary, other.Summary) &&
                string.Equals(Namespace, other.Namespace) &&
                string.Equals(Assembly, other.Assembly) &&
                string.Equals(Syntax, other.Syntax) &&
                SeeAlso.SequenceEqual(other.SeeAlso);
        }

        /// <summary>
        /// Checks if this object is equal to the given.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public override bool Equals(object obj)
        {
            return Equals(obj as PageModel);
        }

        /// <summary>
        /// Computes the hash code of this object.
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            unchecked
            {
                int result = Title.GetHashCode();
                result = result * 3 + Summary.GetHashCode();
                result = result * 5 + Namespace.GetHashCode();
                result = result * 7 + Assembly.GetHashCode();
                result = result * 11 + Syntax.GetHashCode();
                foreach (var s in SeeAlso)
                {
                    result = result * 13 + s.GetHashCode();
                }

                return result;
            }
        }
    }
}
