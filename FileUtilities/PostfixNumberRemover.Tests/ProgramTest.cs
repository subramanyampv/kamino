using System.Collections.Generic;
using System.IO;
using System.IO.Abstractions.TestingHelpers;
using NUnit.Framework;

namespace PostfixNumberRemover.Tests
{
    [TestFixture]
    public class ProgramTest
    {
        class FilenameEndsWithNumberInParenthesis
        {
            [Test]
            public void ShouldRecognizeFilenameWithPostfixNumber()
            {
                Program program = new Program(new MockFileSystem());
                Assert.IsTrue(program.FilenameEndsWithNumberInParenthesis("filename (1).png"));
            }

            [Test]
            public void ShouldNotRecognizeFilenameWithoutPostfixNumber()
            {
                Program program = new Program(new MockFileSystem());
                Assert.IsFalse(program.FilenameEndsWithNumberInParenthesis("filename.png"));
            }
        }

        class DestinationFile
        {
            [Test]
            public void ShouldRemoveTheNumberAndTheParenthesis()
            {
                Program program = new Program(new MockFileSystem());
                Assert.AreEqual("test.png", program.DestinationFile("test (1).png"));
            }
        }

        class CanRenameSafely
        {
            [Test]
            public void ShouldNotRenameWhenTheFileHasNoSuffix()
            {
                Program program = new Program(new MockFileSystem());
                Assert.IsFalse(program.CanRenameSafely("test.png"));
            }

            [Test]
            public void ShouldRenameWhenTheFileHasSuffixAndNoTargetFileExists()
            {
                var sourceFile = Path.Combine(Path.GetTempPath(), "test (1).png");
                var destFile = Path.Combine(Path.GetTempPath(), "test.png");
                Program program = new Program(new MockFileSystem());
                Assert.IsTrue(program.CanRenameSafely(sourceFile));
            }

            [Test]
            public void ShouldNotRenameWhenTheFileHasSuffixAndTargetFileExists()
            {
                var sourceFile = Path.Combine(Path.GetTempPath(), "test (1).png");
                var destFile = Path.Combine(Path.GetTempPath(), "test.png");
                Program program = new Program(new MockFileSystem(new Dictionary<string, MockFileData>()
                {
                    [destFile] = new MockFileData("hello world")
                }));
                Assert.IsFalse(program.CanRenameSafely(sourceFile));
            }
        }
    }
}
