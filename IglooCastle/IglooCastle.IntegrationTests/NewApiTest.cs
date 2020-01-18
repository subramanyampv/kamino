using IglooCastle.Core;
using System.IO;
using System.Linq;
using Xunit;
using Xunit.Abstractions;
using System.Reflection;
using System;

namespace IglooCastle.IntegrationTests
{
    public class NewApiTest : CommonTest
    {
        public NewApiTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact(Skip = "in progress")]
        public override void ShouldProduceExpectedFiles()
        {
            base.ShouldProduceExpectedFiles();
        }

        [Fact(Skip = "in progress")]
        public override void SampleConstructorCorrectContents()
        {
            base.SampleConstructorCorrectContents();
        }

        protected override void Generate(Assembly assembly)
        {
            DocumentationProvider documentation = new DocumentationProvider(new PageProviderFactory());
            documentation.OutputDirectory = OutputDirectory;
            documentation.Add(assembly);
            documentation.Generate();
        }
    }
}
