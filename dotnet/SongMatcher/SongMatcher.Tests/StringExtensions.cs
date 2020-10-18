using System.IO;

namespace SongMatcher.Tests
{

    static class StringExtensions
    {
        public static string NormalizePath(this string s)
        {
            return s.Replace('/', Path.DirectorySeparatorChar);
        }
    }
}
