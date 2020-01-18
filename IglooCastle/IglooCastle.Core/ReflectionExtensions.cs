using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Extension methods to help with reflection.
    /// </summary>
    public static class ReflectionExtensions
	{
		private static readonly MethodAttributes[] allowedAccessMethodAttributes = {
			MethodAttributes.Public,
			MethodAttributes.Family,
			MethodAttributes.Assembly,
			MethodAttributes.FamANDAssem,
			MethodAttributes.FamORAssem
		};

		/// <summary>
		/// Keeps only the access related attributes of the given value.
		/// </summary>
		public static MethodAttributes KeepAccess(this MethodAttributes methodAttributes)
		{
			MethodAttributes allowedAccessMask = allowedAccessMethodAttributes.Aggregate((x,y)=>x|y);
			return methodAttributes & allowedAccessMask;
		}

		private static string FormatSingleAccess(this MethodAttributes access)
		{
			switch (access)
			{
				case MethodAttributes.Family:
					return "protected";
				case MethodAttributes.Public:
					return "public";
				default:
					// TODO: more options + tests
					return access.ToString();
			}
		}

		/// <summary>
		/// Formats the access level.
		/// </summary>
		public static string FormatAccess(this MethodAttributes access)
		{
			return FormatSingleAccess(access);
		}

		/// <summary>
		/// Checks if the given method is overloaded.
		/// </summary>
		public static bool IsOverload(this MethodInfo method)
		{
			return method.ReflectedType.GetPublicAndProtectedMethods().Count(m => m.Name == method.Name) >= 2;
		}

		/// <summary>
		/// Checks if the given method is overriden.
		/// </summary>
		public static bool IsOverride(this MethodInfo method)
		{
			for (Type t = method.DeclaringType.BaseType; t != null; t = t.BaseType)
			{
				if (t.GetMethod(method.Name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic, null, method.GetParameters().Select(p => p.ParameterType).ToArray(), null) != null)
				{
					return true;
				}
			}

			return false;
		}

		/// <summary>
		/// Gets the public and protected constructors of this type.
		/// </summary>
		/// <remarks>
		/// Typically, public and protected members are the ones that need documentation.
		/// </remarks>
		/// <param name="type">This type.</param>
		/// <returns>A collection of <see cref="ConstructorInfo"/> instances.</returns>
		public static IEnumerable<ConstructorInfo> GetPublicAndProtectedConstructors(this Type type)
		{
			return type.GetConstructors(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
				.Where(c => c.IsPublic || c.IsFamily);
		}

		/// <summary>
		/// Gets the public and protected properties of this type.
		/// </summary>
		/// <remarks>
		/// Typically, public and protected members are the ones that need documentation.
		/// </remarks>
		/// <param name="type">This type.</param>
		/// <returns>A collection of <see cref="PropertyInfo"/> instances.</returns>
		public static IEnumerable<PropertyInfo> GetPublicAndProtectedProperties(this Type type)
		{
			return type.GetProperties(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
						   .Where(p => !p.IsSpecialName && (p.IsPublic() || p.IsFamily()));
		}

		/// <summary>
		/// Gets the public and protected methods of this type.
		/// </summary>
		/// <remarks>
		/// Typically, public and protected members are the ones that need documentation.
		/// </remarks>
		/// <param name="type">This type.</param>
		/// <returns>A collection of <see cref="MethodInfo"/> instances.</returns>
		public static IEnumerable<MethodInfo> GetPublicAndProtectedMethods(this Type type)
		{
			return type.GetMethods(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
				.Where(m => !m.IsSpecialName && (m.IsPublic || m.IsFamily));
		}

		/// <summary>
		/// Checks if this property is public.
		/// A property is public if at least one of the accessors is public.
		/// </summary>
		/// <param name="property">This property.</param>
		/// <returns><c>true</c> if at least one of the property accessors is public; <c>false</c> otherwise.</returns>
		public static bool IsPublic(this PropertyInfo property)
		{
			return (property.CanRead && property.GetMethod.IsPublic)
				|| (property.CanWrite && property.SetMethod.IsPublic);
		}

		/// <summary>
		/// Checks if this property is protected.
		/// A property is protected if at least one of the accessors is protected and none of the accessors is public.
		/// </summary>
		/// <param name="property">This property.</param>
		/// <returns><c>true</c> if at least one of the property accessors is protected while neither is public; <c>false</c> otherwise.</returns>
		public static bool IsFamily(this PropertyInfo property)
		{
			return !property.IsPublic() &&
				((property.CanRead && property.GetMethod.IsFamily)
				|| (property.CanWrite && property.SetMethod.IsFamily));
		}

		/// <summary>
		/// Checks if the given property is static.
		/// </summary>
		public static bool IsStatic(this PropertyInfo property)
		{
			return (property.CanRead && property.GetMethod.IsStatic)
				|| (property.CanWrite && property.SetMethod.IsStatic);
		}
	}
}
