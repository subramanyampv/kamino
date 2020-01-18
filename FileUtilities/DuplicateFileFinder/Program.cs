using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DuplicateFileFinder
{
    class Program
    {
        static Dictionary<string, long> fileSizeCache = new Dictionary<string, long>();

        static long GetFileSize(string f)
        {
            if (fileSizeCache.ContainsKey(f))
            {
                return fileSizeCache[f];
            }

            long length;
            try
            {
                FileInfo fileInfo = new FileInfo(f);
                length = fileInfo.Length;
            }
            catch (PathTooLongException ex)
            {
                Console.WriteLine("Path too long {0}", f);
                length = -1;
            }

            fileSizeCache[f] = length;
            return length;
        }

        static bool AreFileSizeEqual(string file1, string file2)
        {
            return GetFileSize(file1) == GetFileSize(file2) && GetFileSize(file1) != -1;
        }

        static bool AreEqual(string file1, string file2)
        {
            if (!AreFileSizeEqual(file1, file2))
            {
                // they are not equal as the size differs
                return false;
            }

            return AreStreamsEqual(file1, file2);
        }

        private static bool AreStreamsEqual(string file1, string file2)
        {
            const int bufLen = 1024;
            byte[] buf1 = new byte[bufLen];
            byte[] buf2 = new byte[bufLen];
            int bytesRead1;
            int bytesRead2;

            using (FileStream stream1 = new FileStream(file1, FileMode.Open, FileAccess.Read))
            {
                using (FileStream stream2 = new FileStream(file2, FileMode.Open, FileAccess.Read))
                {
                    do
                    {
                        bytesRead1 = stream1.Read(buf1, 0, bufLen);
                        bytesRead2 = stream2.Read(buf2, 0, bufLen);
                        if (bytesRead1 != bytesRead2)
                        {
                            throw new InvalidOperationException();
                        }

                        for (var i = 0; i < bytesRead1; i++)
                        {
                            if (buf1[i] != buf2[i])
                            {
                                return false;
                            }
                        }
                    } while (bytesRead1 == bufLen);
                }
            }

            return true;
        }

        /// <summary>
        /// Exclude paths that contain any of the given folders.
        /// </summary>
        /// <param name="paths">The paths to filter.</param>
        /// <param name="excludePaths">The paths to scan for.</param>
        /// <returns></returns>
        static IEnumerable<string> ExcludePaths(IEnumerable<string> paths, params string[] excludePaths)
        {
            var excludePatterns = excludePaths.Select(p => Path.DirectorySeparatorChar + p + Path.DirectorySeparatorChar);
            return paths.Where(p => excludePatterns.All(pat => p.IndexOf(pat, StringComparison.InvariantCultureIgnoreCase) < 0));
        }

        static IEnumerable<string> ScanFiles(string path)
        {
            Console.WriteLine("Scanning path {0}", path);
            return ExcludePaths(Directory.GetFiles(
                path,
                "*.*",
                SearchOption.AllDirectories), "node_modules", ".git");
        }

        static IEnumerable<string> ScanFiles(string[] args)
        {
            return args.Where(a => !a.StartsWith("-")).SelectMany(ScanFiles);
        }

        static void Main(string[] args)
        {
            if (args.Length <= 0)
            {
                Console.WriteLine("Syntax: DuplicateFileFinder pathToScan [pathToScan] [--dry-run]");
                Environment.Exit(1);
                return;
            }

            bool dryRun = args.Contains("--dry-run");

            var files = ScanFiles(args).ToArray();
            Console.WriteLine("REM Found {0} files", files.Length);
            for (int i = 0; i < files.Length; i++)
            {
                var leftFile = files[i];
                if (leftFile == null)
                {
                    continue;
                }

                for (int j = i + 1; j < files.Length; j++)
                {
                    var rightFile = files[j];
                    if (rightFile == null)
                    {
                        continue;
                    }

                    if (AreEqual(leftFile, rightFile))
                    {
                        Console.WriteLine("REM Identical files {0} and {1}", leftFile, rightFile);
                        if (leftFile.Contains("(1)"))
                        {
                            Console.WriteLine("DEL \"{0}\"", leftFile);
                            if (!dryRun)
                            {
                                File.Delete(leftFile);
                            }

                            files[i] = null;
                            break;
                        }
                        else
                        {
                            Console.WriteLine("DEL \"{0}\"", rightFile);
                            if (!dryRun)
                            {
                                File.Delete(rightFile);
                            }

                            files[j] = null; // skip next loops
                        }
                    }
                }
            }
        }
    }
}
