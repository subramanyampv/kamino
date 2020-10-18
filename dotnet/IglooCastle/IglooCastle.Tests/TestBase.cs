using IglooCastle.Core;
using IglooCastle.Demo;
using NUnit.Framework;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Tests
{
    public abstract class TestBase
    {
        private Documentation _documentation;

        protected Documentation Documentation { get { return _documentation; } }

        [SetUp]
        public virtual void SetUp()
        {
            var assemblies = new Assembly[]
            {
                typeof(Documentation).Assembly,
                typeof(CalculatorDemo).Assembly
            };

            _documentation = assemblies.Select(AddAssembly).Aggregate((d1, d2) => d1.Merge(d2));
        }

        private static Documentation AddAssembly(Assembly assembly)
        {
            Documentation documentation = new Documentation();
            documentation.Scan(assembly);

            if (!documentation.AddDocumentation(assembly))
            {
                string assemblyFile = Path.Combine(Environment.CurrentDirectory, Path.GetFileName(assembly.Location));
                if (!documentation.AddDocumentationFromAssemblyFile(assemblyFile))
                {
                    Assert.Fail("Could not find documentation in " + assemblyFile);
                }
            }

            return documentation;
        }
    }
}
