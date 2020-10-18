using System;

namespace IglooCastle.Demo
{
    /// <summary>
    /// Basic calculator demo.
    /// </summary>
    public sealed class CalculatorDemo
    {
        /// <summary>
        /// Adds two numbers.
        /// </summary>
        /// <param name="x">The first number to add.</param>
        /// <param name="y">The second number to add.</param>
        /// <returns>The sum of the two parameters.</returns>
        public int Add(int x, int y)
        {
            return x + y;
        }
    }

    /// <summary>
    /// This class demonstrates comments for nested classes.
    /// </summary>
    public sealed class NestingDemo
    {
        private NestingDemo() {}

        /// <summary>
        /// This class demonstrates a comment on a nested class.
        /// </summary>
        public sealed class NestedDemo
        {
            private NestedDemo() { }
        }
    }

    /// <summary>
    /// This class demonstrates multiple constructors.
    /// </summary>
    public sealed class DemoMultipleConstructors
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public DemoMultipleConstructors()
        {
        }

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="someValue">Some value to initialize with</param>
        public DemoMultipleConstructors(int someValue)
        {
        }
    }

    /// <summary>
    /// This interface demonstrates variance.
    /// </summary>
    /// <typeparam name="T1">The "in" type parameter.</typeparam>
    /// <typeparam name="T2">The "out" type parameter.</typeparam>
    public interface IVariance<in T1, out T2>
    {
    }

    /// <summary>
    /// This class demonstrates constraints on type parameters.
    /// </summary>
    /// <typeparam name="T1">The T1 type parameter</typeparam>
    /// <typeparam name="T2">The second type parameter</typeparam>
    /// <typeparam name="T3">The third type parameter aka T3</typeparam>
    public class GenericConstraints<T1, T2, T3> : IVariance<T1, T2>
        where T1 : class
        where T2 : T1, new()
        where T3 : struct
    {
    }

    /// <summary>
    /// This is an example attribute.
    /// </summary>
    [AttributeUsage(AttributeTargets.All, Inherited = false, AllowMultiple = true)]
    public sealed class DemoAttribute : Attribute
    {
        private readonly string _name;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public DemoAttribute()
        {
        }

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="name">The name of the attribute.</param>
        public DemoAttribute(string name)
        {
            _name = name;
        }

        /// <summary>
        /// Gets the name.
        /// </summary>
        public string Name
        {
            get { return _name; }
        }

        /// <summary>
        /// Gets or sets the optional size.
        /// </summary>
        public int Size { get; set; }
    }

    /// <summary>
    /// This class demonstrates annotations.
    /// </summary>
    [Demo]
    public class AnnotatedDemo
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        [Demo(Size = 10)]
        public AnnotatedDemo()
        { }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        [Demo("name")]
        public string Name { get; set; }

        /// <summary>
        /// Performs a dummy operation.
        /// </summary>
        [Demo("name", Size = 42)]
        public void Test()
        { }
    }

    /// <summary>
    /// This is an example value type.
    /// </summary>
    public struct DemoStruct
    {
        /// <summary>
        /// Gets or sets the price.
        /// </summary>
        public double? Price { get; set; }
    }
}
