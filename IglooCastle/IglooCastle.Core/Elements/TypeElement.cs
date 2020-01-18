using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace IglooCastle.Core.Elements
{
    /// <summary>
    /// Encapsulates a <see cref="Type"/>.
    /// </summary>
    public class TypeElement : ReflectedElement<Type>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="TypeElement"/> class.
        /// </summary>
        /// <param name="owner">The documentation that owns this instance.</param>
        /// <param name="type">The type that this instance represents.</param>
        public TypeElement(Documentation owner, Type type)
            : base(owner, type)
        {
        }

        /// <summary>
        /// Gets the namespace element.
        /// </summary>
        public override NamespaceElement NamespaceElement
        {
            get { return Documentation.Namespaces.Single(n => n.Namespace == Member.Namespace); }
        }

        internal Type Type
        {
            get { return Member; }
        }

        #region Unchanged properties of contained type, exposed.

        /// <summary>
        /// Gets the assembly.
        /// </summary>
        /// <value>The assembly.</value>
        /// <seealso cref="System.Type.Assembly"/>
        public Assembly Assembly
        {
            get { return Member.Assembly; }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is enum.
        /// </summary>
        /// <value><c>true</c> if this instance is enum; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsEnum"/>
        public bool IsEnum
        {
            get { return Member.IsEnum; }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is class.
        /// </summary>
        /// <value><c>true</c> if this instance is class; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsClass"/>
        public bool IsClass
        {
            get { return Member.IsClass; }
        }

        /// <summary>
        /// Gets a value indicating whether this type is a value type.
        /// </summary>
        /// <seealso cref="System.Type.IsValueType"/>
        public bool IsValueType
        {
            get { return Member.IsValueType; }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is interface.
        /// </summary>
        /// <value><c>true</c> if this instance is interface; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsInterface"/>
        public bool IsInterface
        {
            get { return Member.IsInterface; }
        }

        /// <summary>
        /// Gets a value indicating whether this instance is generic type.
        /// </summary>
        /// <value><c>true</c> if this instance is generic type; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsGenericType"/>
        public bool IsGenericType
        {
            get { return Member.IsGenericType; }
        }

        /// <summary>
        /// Gets the namespace.
        /// </summary>
        public string Namespace { get { return Member.Namespace; } }

        /// <summary>
        /// Gets a value indicating whether this instance is array.
        /// </summary>
        /// <value><c>true</c> if this instance is array; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsArray"/>
        public bool IsArray { get { return Member.IsArray; } }

        /// <summary>
        /// Gets a value indicating if this type is passed by reference.
        /// </summary>
        public bool IsByRef { get { return Member.IsByRef; } }

        /// <summary>
        /// Gets a value indicating whether this instance is abstract.
        /// </summary>
        /// <value><c>true</c> if this instance is abstract; otherwise, <c>false</c>.</value>
        /// <seealso cref="System.Type.IsAbstract"/>
        public bool IsAbstract { get { return Member.IsAbstract; } }

        /// <summary>
        /// Gets a value indicating whether this type is sealed.
        /// </summary>
        public bool IsSealed { get { return Member.IsSealed; } }

        /// <summary>
        /// Gets a value indicating whether this type is a generic parameter.
        /// </summary>
        public bool IsGenericParameter { get { return Member.IsGenericParameter; } }

        /// <summary>
        /// Gets a value indicating whether this type is a generic type definition.
        /// </summary>
        public bool IsGenericTypeDefinition { get { return Member.IsGenericTypeDefinition; } }

        /// <summary>
        /// Gets a value indicating whether this type is nested.
        /// </summary>
        public bool IsNested { get { return Member.IsNested; } }

        /// <summary>
        /// Gets the generic parameter attributes.
        /// </summary>
        public GenericParameterAttributes GenericParameterAttributes
        {
            get
            {
                return Member.GenericParameterAttributes;
            }
        }

        #endregion

        /// <summary>
        /// Gets a value indicating whether this type is nullable.
        /// </summary>
        public bool IsNullable
        {
            get
            {
                return Member.IsGenericType
                    && Member.GetGenericTypeDefinition() == typeof(Nullable<>);
            }
        }

        /// <summary>
        /// Gets the base type.
        /// </summary>
        public TypeElement BaseType
        {
            get
            {
                return Documentation.Find(Type.BaseType);
            }
        }

        /// <summary>
        /// Gets the declaring type.
        /// </summary>
        public TypeElement DeclaringType
        {
            get
            {
                return Documentation.Find(Type.DeclaringType);
            }
        }

        /// <summary>
        /// Gets the constructors.
        /// </summary>
        public ICollection<ConstructorElement> Constructors
        {
            get
            {
                return Type.GetPublicAndProtectedConstructors()
                           .Select(c => new ConstructorElement(Documentation, this, c))
                           .ToList();
            }
        }

        /// <summary>
        /// Gets the properties.
        /// </summary>
        public ICollection<PropertyElement> Properties
        {
            get
            {
                return Type.GetPublicAndProtectedProperties()
                    .OrderBy(p => p.Name)
                    .Select(p => new PropertyElement(Documentation, this, p))
                    .ToList();
            }
        }

        /// <summary>
        /// Gets the methods.
        /// </summary>
        public ICollection<MethodElement> Methods
        {
            get
            {
                return Type.GetPublicAndProtectedMethods()
                           .OrderBy(m => m.Name)
                           .Select(m => new MethodElement(Documentation, this, m))
                           .ToList();
            }
        }

        /// <summary>
        /// Gets the extension methods.
        /// </summary>
        public ICollection<MethodElement> ExtensionMethods
        {
            get
            {
                return Documentation.Types.SelectMany(t => t.Methods).Where(m => m.IsExtension() && m.GetParameters()[0].ParameterType.IsAssignableFrom(this)).ToList();
            }
        }

        /// <summary>
        /// Checks if this type is assignable from the given parameter.
        /// </summary>
        public bool IsAssignableFrom(TypeElement t)
        {
            return Member.IsAssignableFrom(t.Member);
        }

        /// <summary>
        /// Gets the nullable type.
        /// </summary>
        public TypeElement GetNullableType()
        {
            if (!IsNullable)
            {
                throw new InvalidOperationException("Type is not nullable");
            }

            return Documentation.Find(Member.GetGenericArguments()[0]);
        }

        /// <summary>
        /// Gets the enum members of this type or an empty list if this type is not an enum.
        /// </summary>
        public ICollection<EnumMemberElement> EnumMembers
        {
            get
            {
                return Type.IsEnum ?
                    Enum.GetNames(Type).Select(n => new EnumMemberElement(Documentation, this, n)).ToList()
                    : new List<EnumMemberElement>(0);
            }
        }

        /// <summary>
        /// Gets the interfaces.
        /// </summary>
        public TypeElement[] GetInterfaces()
        {
            return Member.GetInterfaces().Select(t => Documentation.Find(t)).ToArray();
        }

        /// <summary>
        /// Gets the child types.
        /// </summary>
        public ICollection<TypeElement> GetChildTypes()
        {
            return Documentation.Types.Where(t => t.IsChildTypeOf(this)).ToList();
        }

        /// <summary>
        /// Gets the descendant types.
        /// </summary>
        public ICollection<TypeElement> GetDescendantTypes()
        {
            return Documentation.Types.Where(t => t.IsDescendantTypeOf(this)).ToList();
        }

        /// <summary>
        /// Gets the generic arguments.
        /// </summary>
        public TypeElement[] GetGenericArguments()
        {
            return Member.GetGenericArguments().Select(t => Documentation.Find(t)).ToArray();
        }

        /// <summary>
        /// Gets the generic parameter constraints.
        /// </summary>
        public TypeElement[] GetGenericParameterConstraints()
        {
            return Member.GetGenericParameterConstraints().Select(t => Documentation.Find(t)).ToArray();
        }

        /// <summary>
        /// Checks if this type is a child of the given type.
        /// </summary>
        public bool IsChildTypeOf(TypeElement parentElement)
        {
            if (parentElement == null)
            {
                return false;
            }

            TypeElement myBaseType = BaseType;
            if (myBaseType == null)
            {
                return false;
            }

            if (parentElement.Equals(myBaseType))
            {
                return true;
            }

            if (parentElement.IsGenericTypeDefinition && !myBaseType.IsGenericTypeDefinition && myBaseType.IsGenericType)
            {
                // break my base type down to a definition too
                if (parentElement.Equals(myBaseType.GetGenericTypeDefinition()))
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Checks if this type is a descendant of the given type.
        /// </summary>
        public bool IsDescendantTypeOf(TypeElement ancestorElement)
        {
            if (IsChildTypeOf(ancestorElement))
            {
                return true;
            }

            TypeElement myBaseType = BaseType;
            if (myBaseType == null)
            {
                return false;
            }

            return myBaseType.IsDescendantTypeOf(ancestorElement);
        }

        /// <summary>
        /// Gets a value summarizing the kind of this type.
        /// </summary>
        public string TypeKind
        {
            get
            {
                if (Type.IsEnum)
                {
                    return "Enumeration";
                }

                if (Type.IsValueType)
                {
                    return "Struct";
                }

                if (Type.IsInterface)
                {
                    return "Interface";
                }

                if (Type.IsClass)
                {
                    return "Class";
                }

                // what else?
                return "Type";
            }
        }

        /// <summary>
        /// Gets the filename of this type.
        /// </summary>
        public virtual string Filename()
        {
            return Documentation.FilenameProvider.Filename(Member);
        }

        /// <summary>
        /// Gets the XML comment of this type.
        /// </summary>
        protected override IXmlComment GetXmlComment()
        {
            return Documentation.GetXmlComment("//member[@name=\"T:" + Type.FullName + "\"]");
        }

        /// <summary>
        /// Gets the element type.
        /// </summary>
        public TypeElement GetElementType()
        {
            return Documentation.Find(Member.GetElementType());
        }

        /// <summary>
        /// Gets a value indicating whether this is a static type.
        /// </summary>
        public bool IsStatic { get { return Member.IsAbstract && Member.IsSealed; } }

        /// <summary>
        /// Gets the generic type definition.
        /// </summary>
        public TypeElement GetGenericTypeDefinition()
        {
            return Documentation.Find(Member.GetGenericTypeDefinition());
        }

        /// <summary>
        /// Gets the method by the given name.
        /// </summary>
        public MethodElement GetMethod(string methodName)
        {
            return Methods.Where(m => m.Name == methodName).SingleOrDefault();
        }

        /// <summary>
        /// Gets the method by the given signature.
        /// </summary>
        public MethodElement GetMethod(string methodName, params Type[] parameterTypes)
        {
            return Methods.Where(m => m.Name == methodName
                && m.GetParameters().Select(p => p.ParameterType.Member).SequenceEqual(parameterTypes)).SingleOrDefault();
        }

        /// <summary>
        /// Finds a property by its name.
        /// </summary>
        /// <param name="propertyName">The name of the property.</param>
        /// <returns>The property. If no such property exists, <c>null</c> is returned.</returns>
        public PropertyElement GetProperty(string propertyName)
        {
            return Properties.SingleOrDefault(p => p.Name == propertyName);
        }

        /// <summary>
        /// Gets the constructor of the given signature.
        /// </summary>
        public ConstructorElement GetConstructor(params TypeElement[] types)
        {
            return Constructors.SingleOrDefault(c => c.GetParameters().Select(p => p.ParameterType).SequenceEqual(types));
        }

        /// <summary>
        /// Gets a value indicating whether this is a local type.
        /// </summary>
        public virtual bool IsLocalType
        {
            get
            {
                return true;
            }
        }

        private bool IsSystemType()
        {
            return Namespace == "System" || Namespace.StartsWith("System.");
        }

        /// <summary>
        /// Gets a link to this type.
        /// </summary>
        public string Link()
        {
            if (IsLocalType)
            {
                return Documentation.FilenameProvider.Filename(Member);
            }

            if (IsSystemType() && !IsGenericType)
            {
                return string.Format(
                    "http://msdn.microsoft.com/en-us/library/{0}%28v=vs.110%29.aspx",
                    Member.FullName.ToLowerInvariant());
            }

            return null;
        }
    }
}
