using IglooCastle.Samples;
using System.IO;
using System.Linq;
using Xunit;
using Xunit.Abstractions;
using System.Reflection;
using System.Threading;

namespace IglooCastle.IntegrationTests
{
    /// <summary>
    /// Common base class for integration tests.
    /// This allows to run the same tests for both the old and the new api.
    /// </summary>
    public abstract class CommonTest
    {
        private readonly ITestOutputHelper output;
        private readonly string outputDirectory;

        public CommonTest(ITestOutputHelper output)
        {
            this.output = output;

            // arrange
            // create temp output directory
            this.outputDirectory = CreateTempOutputDirectory();

            // act
            Generate(typeof(Sample).Assembly);
        }

        public ITestOutputHelper Output => this.output;
        public string OutputDirectory => this.outputDirectory;

        [Fact]
        public virtual void ShouldProduceExpectedFiles()
        {
            output.WriteLine($"Testing against directory {outputDirectory}");
            string expectedDataDirectory = "ExpectedData";
            string[] expectedFiles = Directory.GetFiles(expectedDataDirectory).Select(Path.GetFileName).ToArray();
            Assert.True(expectedFiles.Length > 0, "at least one data file should be present: wrong input data");
            string[] actualFiles = Directory.GetFiles(outputDirectory).Select(Path.GetFileName).ToArray();

            foreach (string expectedFile in expectedFiles)
            {
                Assert.True(actualFiles.Contains(expectedFile), $"File {expectedFile} not found in actual files");
                output.WriteLine("Testing file {0}", expectedFile);
                string expectedData = File.ReadAllText(Path.Combine(expectedDataDirectory, expectedFile));
                string actualData = File.ReadAllText(Path.Combine(outputDirectory, expectedFile));
                Assert.Equal(expectedData, actualData, ignoreLineEndingDifferences: true);
            }
        }

        [Fact]
        public virtual void SampleConstructorCorrectFilename()
        {
            string[] actualFiles = Directory.GetFiles(OutputDirectory).Select(Path.GetFileName).ToArray();
            Assert.Contains("C_IglooCastle.Samples.Sample.html", actualFiles);
        }

        [Fact]
        public virtual void SampleConstructorCorrectContents()
        {
            string expectedDataDirectory = "ExpectedData";
            string expectedFile = "C_IglooCastle.Samples.Sample.html";
            string expectedData = File.ReadAllText(Path.Combine(expectedDataDirectory, expectedFile));
            string actualData = File.ReadAllText(Path.Combine(OutputDirectory, expectedFile));
            Assert.Equal(expectedData, actualData, ignoreLineEndingDifferences: true);
        }

        protected abstract void Generate(Assembly assembly);

        private string CreateTempOutputDirectory()
        {
            string outputDirectory = Path.Combine(Path.GetTempPath(), "IglooCastle.IntegrationTests" + Thread.CurrentThread.ManagedThreadId);
            output.WriteLine($"Will generate documentation in {outputDirectory}");
            if (Directory.Exists(outputDirectory))
            {
                Directory.Delete(outputDirectory, true);
            }

            Directory.CreateDirectory(outputDirectory);
            return outputDirectory;
        }
    }
}
