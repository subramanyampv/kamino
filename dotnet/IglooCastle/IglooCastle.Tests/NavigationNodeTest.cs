using IglooCastle.Core.Nodes;
using IglooCastle.Samples;
using NUnit.Framework;
using System;
using System.Linq;

namespace IglooCastle.Tests
{
    [TestFixture]
    class NavigationNodeTest
    {
        [Test]
        public void TestConstructor()
        {
            Type type = typeof(Sample);
            var constructorInfo = type.GetConstructor(Type.EmptyTypes);
            NavigationNode node = new NavigationNode(constructorInfo);
            CollectionAssert.IsEmpty(node.GetChildren().ToArray());
        }

        [Test]
        public void TestSimpleClass()
        {
            Type simpleType = typeof(Simple);
            NavigationNode node = new NavigationNode(simpleType);
            INavigationNode[] childNodesOfType = node.GetChildren().ToArray();
            CollectionAssert.AreEqual(new INavigationNode[]
            {
                new ConstructorsNavigationNode(simpleType),
                new PropertiesNavigationNode(simpleType),
                new MethodsNavigationNode(simpleType)
            }, childNodesOfType);
        }
    }
}
