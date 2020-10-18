using System;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Represents a field in an enum.
    /// </summary>
    public class EnumMemberElement : TypeMemberElement<FieldInfo>
    {
        /// <summary>
        ///
        /// </summary>
        /// <param name="documentation"></param>
        /// <param name="ownerType"></param>
        /// <param name="enumName"></param>
        public EnumMemberElement(Documentation documentation, TypeElement ownerType, string enumName)
            : base(documentation, ownerType, ownerType.Type.GetField(enumName))
        {
        }

        /// <summary>
        /// Gets the ordinal value of the enum field.
        /// </summary>
        public int Value
        {
            get
            {
                return (int)Enum.Parse(OwnerType.Type, Member.Name);
            }
        }

        /// <summary>
		/// Gets the access related attributes of this element.
		/// </summary>
		public override MethodAttributes AccessAttributes
		{
			get
			{
				return MethodAttributes.Public;
			}
		}

        /// <summary>
        /// Gets the XML comment.
        /// </summary>
        protected override IXmlComment GetXmlComment()
        {
            return Documentation.GetXmlComment("//member[@name=\"F:" +
                    OwnerType.Member.FullName + "." +
                    Member.Name + "\"]");
        }
    }
}
