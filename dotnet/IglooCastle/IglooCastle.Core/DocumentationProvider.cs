using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml;

namespace IglooCastle.Core
{
    /// <summary>
    /// Reads XML files that contain documentation of .NET code.
    /// </summary>
    public class DocumentationProvider : IDocumentationProvider
    {
        private List<Assembly> assemblies = new List<Assembly>();

        private readonly IPageProviderFactory pageProviderFactory;

        /// <summary>
        /// Gets or sets the output directory where the documentation should be generated.
        /// </summary>
        public string OutputDirectory { get; set; }

        /// <summary>
        /// Creates an instance of this class.
        /// </summary>
        public DocumentationProvider(IPageProviderFactory pageProviderFactory)
        {
            this.pageProviderFactory = pageProviderFactory;
        }

        /// <summary>
        /// Gets the XML summary of the given constructor.
        /// </summary>
        public string GetSummary(ConstructorInfo constructorInfo)
        {
            Assembly assembly = GetAssembly(constructorInfo);
            foreach (string xmlFile in GetPossibleXmlFiles(assembly).Peek(Console.WriteLine).Where(File.Exists))
            {
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFile);

                string paramString = string.Join(",", constructorInfo.GetParameters().Select(p => p.ParameterType.FullName));
                string attributeValue = constructorInfo.DeclaringType.FullName + "." + "#ctor";
                if (paramString.Length > 0)
                {
                    attributeValue += "(" + paramString + ")";
                }

                XmlNode node = doc.SelectSingleNode("//member[@name=\"M:" + attributeValue + "\"]/summary");
                if (node != null)
                {
                    return node.InnerXml.Trim();
                }
                else
                {
                    Console.WriteLine("not found " + attributeValue);
                }
            }

            return "";
        }

        private static IEnumerable<string> GetPossibleXmlFiles(Assembly assembly)
        {
            yield return Path.ChangeExtension(assembly.Location, ".xml");
            yield return Path.ChangeExtension(Path.Combine(Environment.CurrentDirectory, Path.GetFileName(assembly.Location)), ".xml");
        }

        private static Assembly GetAssembly(ConstructorInfo constructorInfo)
        {
            return constructorInfo.DeclaringType.Assembly;
        }

        /// <summary>
        /// Adds an assembly to the set of assemblies that will be documented.
        /// </summary>
        public void Add(Assembly assembly)
        {
            assemblies.Add(assembly);
        }

        /// <summary>
        /// Generates documentation for the selected assemblies.
        /// </summary>
        public void Generate()
        {
            IEnumerable<RenderResult> results = assemblies.SelectMany(GenerateTree);
            foreach (var result in results)
            {
                File.WriteAllText(Path.Combine(OutputDirectory, result.Filename), result.Contents);
            }
        }

        private IEnumerable<RenderResult> GenerateTree(Assembly assembly)
        {
            return Generate(assembly).Concat(GenerateChildren(assembly));
        }

        private IEnumerable<RenderResult> Generate(Assembly assembly)
        {
            return Enumerable.Empty<RenderResult>();
        }

        private IEnumerable<RenderResult> GenerateChildren(Assembly assembly)
        {
            return assembly.GetTypes().SelectMany(GenerateTree);
        }

        private IEnumerable<RenderResult> GenerateTree(Type type)
        {
            return Generate(type).Concat(GenerateChildren(type));
        }

        private IEnumerable<RenderResult> Generate(Type type)
        {
            return pageProviderFactory.CreateTypeProviders().SelectMany(p => p.Render(type));
        }

        private IEnumerable<RenderResult> GenerateChildren(Type type)
        {
            var ctors = type.GetConstructors();
            var ctorResults = ctors.SelectMany(Generate);

            var methods = type.GetMethods();
            var methodResults = methods.SelectMany(Generate);

            var properties = type.GetProperties();
            var propertyResults = properties.SelectMany(Generate);

            return ctorResults.Concat(methodResults).Concat(propertyResults);
        }

        private IEnumerable<RenderResult> Generate(ConstructorInfo constructor)
        {
            return pageProviderFactory.CreateConstructorPageProviders().SelectMany(p => p.Render(constructor));
        }

        private IEnumerable<RenderResult> Generate(MethodInfo method)
        {
            return Enumerable.Empty<RenderResult>();
        }

        private IEnumerable<RenderResult> Generate(PropertyInfo property)
        {
            return Enumerable.Empty<RenderResult>();
        }
    }
}
