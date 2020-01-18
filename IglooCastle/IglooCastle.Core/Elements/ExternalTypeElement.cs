using System;

namespace IglooCastle.Core.Elements
{
    internal sealed class ExternalTypeElement : TypeElement
	{
		public ExternalTypeElement(Documentation owner, Type type) : base(owner, type)
		{
		}

		public override string Filename()
		{
			return null;
		}

		public override bool IsLocalType
		{
			get
			{
				if (IsGenericParameter)
				{
					return false;
				}

				if (IsGenericType && !IsGenericTypeDefinition)
				{
					return GetGenericTypeDefinition().IsLocalType;
				}

				return false;
			}
		}
	}
}
