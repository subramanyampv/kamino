using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// A code element that is a member of a type.
    /// </summary>
    public abstract class TypeMemberElement<T> : ReflectedElement<T>
        where T: MemberInfo
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        protected TypeMemberElement(Documentation documentation, TypeElement ownerType, T member) : base(documentation, member)
        {
            OwnerType = ownerType;
        }

        /// <summary>
        /// Gets the owner type.
        /// </summary>
        public TypeElement OwnerType { get; private set; }

        /// <summary>
        /// Gets the reflected type.
        /// </summary>
        public TypeElement ReflectedType { get { return Documentation.Find(Member.ReflectedType); } }

        /// <summary>
        /// Gets the declaring type.
        /// </summary>
        public TypeElement DeclaringType { get { return Documentation.Find(Member.DeclaringType); } }

        /// <summary>
        /// Gets the namespace element.
        /// </summary>
        public override NamespaceElement NamespaceElement
        {
            get { return Documentation.Namespaces.Single(n => n.Namespace == OwnerType.Member.Namespace); }
        }

        /// <summary>
        /// Gets a value indicating whether the element is inherited or not.
        /// </summary>
        public bool IsInherited
        {
            get
            {
                return Member.DeclaringType != OwnerType.Type;
            }
        }

        /// <summary>
        /// Gets the access related attributes of this element.
        /// </summary>
        public abstract MethodAttributes AccessAttributes { get; }
    }
}
