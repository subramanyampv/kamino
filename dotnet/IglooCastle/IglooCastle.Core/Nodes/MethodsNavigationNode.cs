using System;
using System.Collections.Generic;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents an overview of all the methods of a class.
    /// </summary>
    public class MethodsNavigationNode : TypeCentricNavigationNode
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="type"></param>
        public MethodsNavigationNode(Type type) : base(type)
        {
        }

        /// <summary>
        /// Gets the child nodes of this node.
        /// </summary>
        /// <returns></returns>
        public override IEnumerable<INavigationNode> GetChildren()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets the filename of this node.
        /// </summary>
        /// <returns></returns>
        public override string GetFilename()
        {
            throw new NotImplementedException();
        }
    }
}
