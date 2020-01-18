using System.Collections.Generic;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents a navigation node in the hierarchy.
    /// </summary>
    public interface INavigationNode
    {
        /// <summary>
        /// Gets the child nodes of this node.
        /// </summary>
        /// <returns></returns>
        IEnumerable<INavigationNode> GetChildren();

        /// <summary>
        /// Gets the filename of this node.
        /// </summary>
        /// <returns></returns>
        string GetFilename();
    }
}
