using System;
using System.Collections.Generic;

namespace IglooCastle.Core
{
	/// <summary>
	/// Helper methods for system types.
	/// </summary>
    public static class SystemTypes
	{
		private static readonly Dictionary<Type, string> Aliases = new Dictionary<Type, string>
			{
				{ typeof(string), "string" },
				{ typeof(bool), "bool" },
				{ typeof(int), "int" },
				{ typeof(void), "void"},
				{ typeof(object), "object" },
				{ typeof(double), "double" }
			};

		/// <summary>
		/// Gets the shorthand alias of a system type.
		/// </summary>
		public static string Alias(Type type)
		{
			return Aliases.ContainsKey(type) ? Aliases[type] : null;
		}
	}
}
