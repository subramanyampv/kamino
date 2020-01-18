using IglooCastle.Core;
using IglooCastle.Core.Nodes;
using IglooCastle.Samples;
using Xunit.Abstractions;
using System.Reflection;

namespace IglooCastle.IntegrationTests
{
    public class OldApiTest : CommonTest
    {
        public OldApiTest(ITestOutputHelper output) : base(output)
        {
        }

        protected override void Generate(Assembly assembly)
        {
            Documentation documentation = new Documentation();
            documentation.Scan(typeof(Sample).Assembly);
            documentation.AddDocumentation(typeof(Sample).Assembly);

            Generator generator = new Generator();
            generator.Generate(documentation, OutputDirectory);
        }
    }
}
