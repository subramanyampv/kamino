using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents a navigation node in the hierarchy.
    /// </summary>
    public class NavigationNode : INavigationNode
    {
        private dynamic member;

        /// <summary>
        /// Creates an instance of the <see cref="NavigationNode"/> class.
        /// </summary>
        /// <param name="member"></param>
        public NavigationNode(MemberInfo member)
        {
            this.member = member;
        }

        /// <summary>
        /// Gets the child nodes of this node.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<INavigationNode> GetChildren()
        {
            return GetChildren(member);
        }

        /// <summary>
        /// Gets the filename of this node.
        /// </summary>
        /// <returns></returns>
        public string GetFilename()
        {
            return GetFilename(member);
        }

        #region GetFilename

        private string GetFilename(ConstructorInfo constructorInfo)
        {
            return constructorInfo.DeclaringType.Namespace + "_" + constructorInfo.DeclaringType.Name + "_ctor" + ".html";
        }

        #endregion

        #region GetChildren

        private IEnumerable<INavigationNode> GetChildren(ConstructorInfo constructorInfo)
        {
            return Enumerable.Empty<NavigationNode>();
        }

        private IEnumerable<INavigationNode> GetChildren(Type type)
        {
            yield return new ConstructorsNavigationNode(type);
            yield return new PropertiesNavigationNode(type);
            yield return new MethodsNavigationNode(type);
        }
     
        #endregion
    }
}
