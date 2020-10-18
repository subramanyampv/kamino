using System.Reflection;
using System.Runtime.CompilerServices;

namespace IglooCastle.Core.Elements
{
	/// <summary>
	/// The method element.
	/// </summary>
    public class MethodElement : MethodBaseElement<MethodInfo>
	{
		/// <summary>
		/// Creates an instance of this class.
		/// </summary>
		public MethodElement(Documentation documentation, TypeElement ownerType, MethodInfo method)
			: base(documentation, ownerType, method)
		{
		}

		internal MethodInfo Method
		{
			get { return Member; }
		}

		/// <summary>
		/// Gets a value indicating whether this method is static.
		/// </summary>
		public bool IsStatic
		{
			get { return Member.IsStatic; }
		}

		/// <summary>
		/// Gets a value indicating whether this method is abstract.
		/// </summary>
		public bool IsAbstract
		{
			get { return Member.IsAbstract; }
		}

		/// <summary>
		/// Gets a value indicating whether this method is virtual.
		/// </summary>
		public bool IsVirtual
		{
			get { return Member.IsVirtual; }
		}

		/// <summary>
		/// Gets a value indicating whether this method is override.
		/// </summary>
		public bool IsOverride
		{
			get { return Member.IsOverride(); }
		}

		/// <summary>
		/// Gets a value indicating whether this method is overloaded.
		/// </summary>
		public bool IsOverload
		{
			get { return Member.IsOverload(); }
		}

		/// <summary>
		/// Gets the return type.
		/// </summary>
		public TypeElement ReturnType
		{
			get { return Documentation.Find(Member.ReturnType); }
		}

		/// <summary>
		/// Gets a value indicating whether this method is private.
		/// </summary>
		public bool IsPrivate
		{
			get
			{
				return Member.IsPrivate;
			}
		}

        /// <summary>
        /// Checks if this method is an extension method.
        /// </summary>
        /// <returns><c>true</c> if this is an extension method, <c>false</c> otherwise.</returns>
        public bool IsExtension()
        {
            bool isExtension = Member.GetCustomAttribute<ExtensionAttribute>() != null;
            return isExtension;
        }

		/// <summary>
		/// Gets the filename.
		/// </summary>
		public string Filename()
		{
			return Documentation.FilenameProvider.Filename(Member);
		}

		/// <summary>
		/// Gets the XML comment.
		/// </summary>
		protected override IXmlComment GetXmlComment()
		{
			return Documentation.GetMethodDocumentation(OwnerType.Type, Method.Name, Method.GetParameters());
		}

		/// <summary>
		/// Gets a value indicating whether this method is final.
		/// </summary>
		public bool IsFinal { get { return Member.IsFinal; } }

		/// <summary>
		/// Gets the link.
		/// </summary>
		public string Link()
		{
			if (DeclaringType.IsLocalType)
			{
				return Documentation.FilenameProvider.Filename(Member);
			}

			return null;
		}
	}
}
