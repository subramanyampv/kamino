using IglooCastle.Core;
using IglooCastle.Core.Nodes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace IglooCastle.CLI
{
    class Program
    {
        /// <summary>
        /// For every assembly that is loaded, its path is added to this list.
        /// When attempting to resolve an assembly all these paths will be examined.
        /// </summary>
        private readonly List<string> _possibleAssemblyPaths = new List<string>();

        private readonly Options _options;

        public Program(Options options)
        {
            _options = options;

            #if DEBUG
            if (_options.InputAssemblies.Length == 0)
            {
                _options.InputAssemblies = new string[]
                    {
                        Assembly.GetExecutingAssembly().Location
                    };
            }
            #endif

            _options.OutputDirectory = _options.OutputDirectory ?? Path.GetFullPath(Environment.CurrentDirectory);
        }

        static void Main(string[] args)
        {
            Program p = new Program(Options.Parse(args));
            p.Run();
        }

        private void Run()
        {
            // hook in assembly resolver event handler
            AddAssemblyResolver();

            // aggregate documentation
            Documentation documentation = new Documentation();
            documentation = _options.InputAssemblies.Aggregate(
                documentation,
                (current, arg) => current.Merge(ProcessAssembly(arg)));

            // run python generator
            RunGenerator(documentation);
            Console.WriteLine("All done");
        }

        private void AddAssemblyResolver()
        {
            AppDomain.CurrentDomain.AssemblyResolve += CurrentDomain_AssemblyResolve;
        }
        
        private Assembly CurrentDomain_AssemblyResolve(object sender, ResolveEventArgs args)
        {
            return (
                from p in _possibleAssemblyPaths
                let fullPath = Path.Combine(p, args.Name) + ".dll"
                where File.Exists(fullPath)
                select Assembly.LoadFrom(fullPath)
            ).FirstOrDefault();
        }

        private void RunGenerator(Documentation documentation)
        {
            string outputDirectory = Path.GetFullPath(_options.OutputDirectory);
            Directory.CreateDirectory(outputDirectory);

            // path of IglooCastle.exe
            // this is also the path where the CSS/JS are supposed to be and also the generator.py
            string assemblyPath = Path.GetFullPath(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));

            // run documentation generator
            var generator = new Generator();
            generator.Generate(documentation, outputDirectory);

            // copy CSS/JS to output folder
            if (assemblyPath != outputDirectory)
            {
                Console.WriteLine("Copying static files");
                CopyStatic(assemblyPath, outputDirectory, "app.js", "jquery-1.11.1.min.js", "style.css");
            }
        }

        private static void CopyStatic(string fromPath, string toPath, params string[] files)
        {
            foreach (string file in files)
            {
                CopyStatic(Path.Combine(fromPath, file), Path.Combine(toPath, file));
            }
        }

        private static void CopyStatic(string source, string destination)
        {
            if (!File.Exists(destination))
            {
                File.Copy(source, destination);
            }
        }

        private Documentation ProcessAssembly(string assemblyFile)
        {
            Console.WriteLine("Processing assembly {0}", assemblyFile);

            try
            {
                string assemblyFullPath = Path.GetFullPath(assemblyFile);
                _possibleAssemblyPaths.Add(Path.GetDirectoryName(assemblyFullPath));
                Assembly assembly = Assembly.LoadFrom(assemblyFullPath);
                Documentation documentation = new Documentation();
                documentation.Scan(assembly);
                if (!documentation.AddDocumentationFromAssemblyFile(assemblyFullPath))
                {
                    Console.WriteLine("Could not find matching xml file for assembly {0}", assemblyFullPath);
                }

                return documentation;
            }
            catch (ReflectionTypeLoadException ex)
            {
                Console.WriteLine("Could not load assembly {0}", assemblyFile);
                foreach (Exception loaderEx in ex.LoaderExceptions)
                {
                    Console.WriteLine(loaderEx);
                }

                throw;
            }
        }
    }

}
