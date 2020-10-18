using System.Collections.Generic;

namespace IglooCastle.Core.Elements
{
	/// <summary>
	/// Represents a container of types.
	/// </summary>
    public interface ITypeContainer
	{
		/// <summary>
		/// Gets the types in this container.
		/// </summary>
		ICollection<TypeElement> Types { get; }
	}
}
