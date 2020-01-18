using System;

namespace IglooCastle.Samples
{
    /// <summary>
    /// A sample class for test purposes.
    /// </summary>
    public sealed class Sample : IEquatable<Sample>
    {
        /// <summary>
        /// Initializes an instance of the <see cref="Sample"/> class.
        /// </summary>
        public Sample()
        {

        }

        public bool Equals(Sample other)
        {
            throw new NotImplementedException();
        }

        public sealed class NestedSample
        {
            public sealed class SecondLevelNest
            {

            }
        }
    }
}
