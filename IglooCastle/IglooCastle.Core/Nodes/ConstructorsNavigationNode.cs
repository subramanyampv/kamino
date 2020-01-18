using System;
using System.Collections.Generic;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents an overview node of all the constructors of a class.
    /// </summary>
    public class ConstructorsNavigationNode : TypeCentricNavigationNode
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="type"></param>
        public ConstructorsNavigationNode(Type type) : base(type)
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
