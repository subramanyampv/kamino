using System.Collections.Generic;
using System.Linq;

namespace IglooCastle.Samples
{
    /// <summary>
    /// A simple class.
    /// </summary>
    public class Simple
    {
        private readonly string name;

        /// <summary>
        /// Creates an instance of the <see cref="Simple"/> class.
        /// </summary>
        /// <param name="name">The name parameter</param>
        public Simple(string name)
        {
            this.name = name;
        }

        /// <summary>
        /// Gets the name of this object.
        /// </summary>
        public string Name
        {
            get
            {
                return name;
            }
        }

        /// <summary>
        /// Greets a person.
        /// </summary>
        public string Greet(string name) => $"Hello, ${name}!";

        /// <summary>
        /// Greets multiple persons.
        /// </summary>
        public string GreetMany(IEnumerable<string> persons) => string.Join(", ", persons.Select(Greet));
    }
}
