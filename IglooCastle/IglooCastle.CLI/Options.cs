using System.Linq;

namespace IglooCastle.CLI
{
    /// <summary>
    /// Holds the options of the program.
    /// </summary>
    public class Options
    {
        private Options()
        {
        }

        /// <summary>
        /// Parses the command line arguments and returns the options.
        /// </summary>
        /// <param name="args">The command line arguments</param>
        /// <returns>A new Options instance.</returns>
        public static Options Parse(string[] args)
        {
            return new Options
            {
                InputAssemblies = args.Where(a => !string.IsNullOrEmpty(a) && !a.StartsWith("-")).ToArray(),
                OutputDirectory = Find(args, "--output=")
            };
        }

        /// <summary>
        /// Gets or sets the input assemblies to document.
        /// </summary>
        public string[] InputAssemblies
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the directory in which documentation will be written.
        /// </summary>
        public string OutputDirectory
        {
            get;
            set;
        }

        private static string Find(string[] args, string arg)
        {
            string value = args.FirstOrDefault(a => a.StartsWith(arg));
            if (value != null)
            {
                return value.Substring(arg.Length).Trim();
            }

            return null;
        }
    }
}
