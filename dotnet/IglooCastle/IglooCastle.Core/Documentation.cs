using IglooCastle.Core.Elements;
using IglooCastle.Core.Printers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml;

namespace IglooCastle.Core
{
    /// <summary>
    /// Represents the documentation of one or more assemblies.
    /// </summary>
    public class Documentation : ITypeContainer
    {
        private readonly List<NamespaceElement> _namespaces = new List<NamespaceElement>();
        private TypeElement[] _types = new TypeElement[0];
        private readonly List<XmlDocument> _documentationSources = new List<XmlDocument>();

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        /// <remarks>
        /// The <see cref="FilenameProvider"/> and <see cref="TypePrinter"/> are set to default values.
        /// </remarks>
        public Documentation()
        {
            FilenameProvider = new FilenameProvider();
        }

        /// <summary>
        /// Gets or sets the filename provider.
        /// </summary>
        internal FilenameProvider FilenameProvider { get; set; }

        /// <summary>
        /// Gets or sets the namespaces.
        /// </summary>
        public IList<NamespaceElement> Namespaces
        {
            get { return _namespaces; }

            set
            {
                _namespaces.Clear();
                if (value != null)
                {
                    _namespaces.AddRange(value);
                    SortNamespaces();
                }
            }
        }

        private void SortNamespaces()
        {
            _namespaces.Sort((a, b) => a.Namespace.CompareTo(b.Namespace));
        }

        /// <summary>
        /// Gets or sets the types.
        /// </summary>
        public ICollection<TypeElement> Types
        {
            get { return _types; }
            set { _types = value != null ? value.ToArray() : new TypeElement[0]; }
        }

        /// <summary>
        /// Gets the documentation sources.
        /// </summary>
        public ICollection<XmlDocument> DocumentationSources
        {
            get
            {
                return _documentationSources;
            }

            private set
            {
                _documentationSources.Clear();
                _documentationSources.AddRange(value ?? Enumerable.Empty<XmlDocument>());
            }
        }

        /// <summary>
        /// Merges this instance with the given instance.
        /// </summary>
        public Documentation Merge(Documentation that)
        {
            return new Documentation
                {
                    Namespaces = Namespaces.Union(that.Namespaces).ToArray(),
                    Types = Types.Union(that.Types).ToArray(),
                    DocumentationSources = DocumentationSources.Union(that.DocumentationSources).ToArray()
                };
        }

        /// <summary>
        /// Scans the given assembly for types, members, etc.
        /// </summary>
        public void Scan(Assembly assembly)
        {
            HashSet<string> namespaces = new HashSet<string>();
            List<TypeElement> types = new List<TypeElement>();
            foreach (Type type in assembly.GetTypes().Where(t => t.IsVisible))
            {
                namespaces.Add(type.Namespace ?? string.Empty);
                types.Add(new TypeElement(this, type));
            }

            Namespaces = namespaces.Select(n => new NamespaceElement(this, n)).ToArray();
            Types = types.ToArray();
        }

        internal XmlComment GetMethodDocumentation(Type type, string methodName, ParameterInfo[] parameters)
        {
            string paramString = string.Join(",", parameters.Select(p => p.ParameterType.FullName));
            string attributeValue = type.FullName + "." + methodName + "(" + paramString + ")";
            return GetXmlComment("//member[@name=\"M:" + attributeValue + "\"]");
        }

        internal XmlComment GetXmlComment(string selector)
        {
            return DocumentationSources.Select(xmlDoc => GetXmlComment(xmlDoc, selector)).FirstOrDefault(c => c != null);
        }

        private XmlComment GetXmlComment(XmlDocument doc, string selector)
        {
            if (doc == null)
            {
                return null;
            }

            XmlNode node = doc.SelectSingleNode(selector);
            if (node == null)
            {
                return null;
            }

            return new XmlComment(this, (XmlElement)node);
        }

        /// <summary>
        /// Adds the given assembly to the list of assemblies to document.
        /// </summary>
        public bool AddDocumentation(Assembly assembly)
        {
            return AddDocumentationFromAssemblyFile(assembly.Location);
        }

        /// <summary>
        /// Adds documentation source for the given assembly.
        /// </summary>
        public bool AddDocumentationFromAssemblyFile(string assemblyFile)
        {
            return AddDocumentationFromXmlFile(Path.ChangeExtension(assemblyFile, "xml"))
                || AddDocumentationFromXmlFile(Path.ChangeExtension(assemblyFile, "XML"));
        }

        private bool AddDocumentationFromXmlFile(string xmlFile)
        {
            if (!File.Exists(xmlFile))
            {
                Console.WriteLine("Could not find xml file {0}", xmlFile);
                return false;
            }

            XmlDocument doc = new XmlDocument();
            doc.Load(xmlFile);
            DocumentationSources.Add(doc);
            return true;
        }

        /// <summary>
        /// Finds the given type.
        /// </summary>
        public TypeElement Find(Type type)
        {
            return type == null
                ? null :
                (Types.FirstOrDefault(t => t.Type == type) ?? new ExternalTypeElement(this, type));
        }

        /// <summary>
        /// Finds the given namespace.
        /// </summary>
        public NamespaceElement FindNamespace(string name)
        {
            return Namespaces.FirstOrDefault(n => n.Member == name);
        }
    }
}
