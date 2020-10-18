using System;
using System.IO;
using System.IO.Abstractions;
using System.Text.RegularExpressions;

namespace PostfixNumberRemover
{
    public class Program
    {
        private readonly IFileSystem _fileSystem;

        public Program(IFileSystem fileSystem)
        {
            _fileSystem = fileSystem;
        }

        static void Main(string[] args)
        {
            var program = new Program(new FileSystem());
            foreach (var file in Directory.GetFiles(args[0], "*.*", SearchOption.AllDirectories))
            {
                if (!program.FilenameEndsWithNumberInParenthesis(file))
                {
                    continue;
                }

                Console.WriteLine(file);

                if (program.CanRenameSafely(file))
                {
                    Console.WriteLine(program.DestinationFile(file));
                    File.Move(file, program.DestinationFile(file));
                }
                else
                {
                    Console.WriteLine("sorry!");
                }
            }
        }

        public bool FilenameEndsWithNumberInParenthesis(string path)
        {
            var p = Path.GetFileNameWithoutExtension(path);
            return p != null && Regex.IsMatch(p, @"\([0-9]+\)$");
        }

        public bool CanRenameSafely(string path)
        {
            if (!FilenameEndsWithNumberInParenthesis(path))
            {
                return false;
            }

            var targetPath = DestinationFile(path);

            if (_fileSystem.File.Exists(targetPath))
            {
                return false;
            }

            return true;
        }

        public string DestinationFile(string path)
        {
            string directory = Path.GetDirectoryName(path);
            string extension = Path.GetExtension(path);
            string name = Path.GetFileNameWithoutExtension(path);
            string newName = Regex.Replace(name, @" ?\([0-9]+\)$", "");
            return Path.Combine(directory, newName + extension);
        }
    }
}
