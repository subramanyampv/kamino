using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
	/// <summary>
	/// Base class for method base elements.
	/// </summary>
    public abstract class MethodBaseElement<T> : TypeMemberElement<T>
		where T : MethodBase
	{
		/// <summary>
		/// Creates an instance of this class.
		/// </summary>
		protected MethodBaseElement(Documentation documentation, TypeElement ownerType, T member)
			: base(documentation, ownerType, member)
		{
		}

		/// <summary>
		/// Gets the parameters.
		/// </summary>
		public ParameterInfoElement[] GetParameters()
		{
			return Member.GetParameters().Select(p => new ParameterInfoElement(Documentation, p)).ToArray();
		}

		/// <summary>
		/// Gets the access related attributes of this element.
		/// </summary>
		public override MethodAttributes AccessAttributes
		{
			get
			{
				return Member.Attributes.KeepAccess();
			}
		}
	}
}
