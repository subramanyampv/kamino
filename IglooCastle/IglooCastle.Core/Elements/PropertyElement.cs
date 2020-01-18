using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Represents a property.
    /// </summary>
    public class PropertyElement : TypeMemberElement<PropertyInfo>
    {
        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public PropertyElement(Documentation documentation, TypeElement ownerType, PropertyInfo property)
            : base(documentation, ownerType, property)
        {
        }

        internal PropertyInfo Property
        {
            get { return Member; }
        }

        /// <summary>
        /// Gets the property type.
        /// </summary>
        public TypeElement PropertyType
        {
            get { return Documentation.Find(Property.PropertyType); }
        }

        /// <summary>
        /// Gets a value indicating whether the property is readable.
        /// </summary>
        public bool CanRead
        {
            get { return Member.CanRead; }
        }

        /// <summary>
        /// Gets a value indicating whether the property is writeable.
        /// </summary>
        public bool CanWrite
        {
            get { return Member.CanWrite; }
        }

        /// <summary>
        /// Gets the getter method.
        /// </summary>
        public MethodElement GetMethod
        {
            get
            {
                return new MethodElement(Documentation, OwnerType, Member.GetMethod);
            }
        }

        /// <summary>
        /// Gets the setter method.
        /// </summary>
        public MethodElement SetMethod
        {
            get
            {
                return new MethodElement(Documentation, OwnerType, Member.SetMethod);
            }
        }

        /// <summary>
        /// Gets the access related attributes of this element.
        /// </summary>
        public override MethodAttributes AccessAttributes
        {
            get
            {
                MethodAttributes getterAccess = Member.CanRead ? Member.GetMethod.Attributes.KeepAccess() : MethodAttributes.PrivateScope;
                MethodAttributes setterAccess = Member.CanWrite ? Member.SetMethod.Attributes.KeepAccess() : MethodAttributes.PrivateScope;
                return Max(getterAccess, setterAccess);
            }
        }

        /// <summary>
        /// Gets the base class property.
        /// </summary>
        public PropertyElement BasePropertyElement()
        {
            TypeElement baseTypeElement = OwnerType.BaseType;
            if (baseTypeElement == null)
            {
                return null;
            }

            return baseTypeElement.Properties.FirstOrDefault(p => p.Name == Name);
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
            IXmlComment result = Documentation.GetXmlComment("//member[@name=\"P:" +
                    Property.ReflectedType.FullName + "." +
                    Property.Name + "\"]");

            if (result == null)
            {
                var basePropertyElement = BasePropertyElement();
                if (basePropertyElement != null)
                {
                    result = basePropertyElement.GetXmlComment();
                }
            }

            return result;
        }

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

        private static MethodAttributes Max(MethodAttributes a, MethodAttributes b)
        {
            if (a == b)
            {
                return a;
            }

            MethodAttributes[] order = new[]
            {
                MethodAttributes.PrivateScope,
                MethodAttributes.Private,
                MethodAttributes.FamANDAssem,
                MethodAttributes.Assembly,
                MethodAttributes.Family,
                MethodAttributes.FamORAssem,
                MethodAttributes.Public
            };

            for (int idx = order.Length - 1; idx >= 0; idx--)
            {
                if (a == order[idx])
                {
                    return a;
                }

                if (b == order[idx])
                {
                    return b;
                }
            }

            return MethodAttributes.PrivateScope;
        }
    }
}
