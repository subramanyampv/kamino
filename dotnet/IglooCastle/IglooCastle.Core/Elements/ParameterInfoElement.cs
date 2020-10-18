using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
	/// <summary>
	/// Information about a parameter.
	/// </summary>
    public class ParameterInfoElement : DocumentationElement<ParameterInfo>
	{
		/// <summary>
		/// Creates an instance of this class.
		/// </summary>
		public ParameterInfoElement(Documentation documentation, ParameterInfo parameterInfo)
			: base(documentation, parameterInfo)
		{
		}

		/// <summary>
		/// Gets the xml comment.
		/// </summary>
		public override IXmlComment XmlComment
		{
			get { throw new NotImplementedException(); }
		}

		/// <summary>
		/// Gets a value indicating whether this is an out parameter.
		/// </summary>
		public bool IsOut
		{
			get
			{
				return Member.IsOut;
			}
		}

		/// <summary>
		/// Gets the name.
		/// </summary>
		public string Name
		{
			get
			{
				return Member.Name;
			}
		}

		/// <summary>
		/// Gets the parameter type.
		/// </summary>
		public TypeElement ParameterType
		{
			get
			{

				return Documentation.Find(Member.ParameterType);
			}
		}

		/// <summary>
		/// Gets a value indicating whether this is a <c>params</c> parameter.
		/// </summary>
		/// <value><c>true</c> if this parameter is <c>params</c>; otherwise, <c>false</c>.</value>
		public bool IsParams
		{
			get
			{
				return Member.GetCustomAttribute<ParamArrayAttribute>() != null;
			}
		}
	}
}
