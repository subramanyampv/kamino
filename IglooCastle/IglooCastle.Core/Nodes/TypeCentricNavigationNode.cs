using System;
using System.Collections.Generic;

namespace IglooCastle.Core.Nodes
{
    /// <summary>
    /// Represents a node that is related to a specific type.
    /// </summary>
    public abstract class TypeCentricNavigationNode : INavigationNode
    {
        private readonly Type type;

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <param name="type"></param>
        public TypeCentricNavigationNode(Type type)
        {
            this.type = type;
        }

        /// <summary>
        /// Gets the type associated with this node.
        /// </summary>
        public Type Type
        {
            get
            {
                return type;
            }
        }

        /// <summary>
        /// Gets the child nodes of this node.
        /// </summary>
        /// <returns></returns>
        public abstract IEnumerable<INavigationNode> GetChildren();

        /// <summary>
        /// Gets the filename of this node.
        /// </summary>
        /// <returns></returns>
        public abstract string GetFilename();

        /// <summary>
        /// Creates a text representation of this object.
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return string.Format("{0} Type={1}", GetType(), Type);
        }

        /// <summary>
        /// Checks if this object is equal to the given object.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public override bool Equals(object obj)
        {
            TypeCentricNavigationNode that = obj as TypeCentricNavigationNode;
            if (that == null)
            {
                return false;
            }

            // must be same class of node
            // and must hold same class
            return GetType() == that.GetType() && Type == that.Type;
        }

        /// <summary>
        /// Gets the hash code of this object.
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            return GetType().GetHashCode() ^ Type.GetHashCode();
        }
    }
}
