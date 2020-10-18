using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Reflection;

namespace IglooCastle.Core
{
    /// <summary>
    /// Provides filenames for various elements.
    /// </summary>
    public sealed class FilenameProvider
    {
        /// <summary>
        /// Provides the filename for a namespace element.
        /// </summary>
        public string Filename(string @namespace, string prefix = "N", string suffix = "html")
        {
            return string.Format("{0}_{1}.{2}", prefix, @namespace, suffix);
        }

        /// <summary>
        /// Provides the filename for this type.
        /// </summary>
        public string Filename(Type type) => $"T_{FilenamePartForMainType(type)}.html";

        /// <summary>
        /// Provides the filename for a constructor or a method.
        /// </summary>
        public string Filename(MethodBase methodBase)
        {
            string typePart = FilenamePartForMainType(methodBase.DeclaringType);
            string parameters = ParametersFilename(methodBase.GetParameters());
            string suffix = string.IsNullOrEmpty(parameters) ? string.Empty : "-" + parameters;
            string prefix = methodBase is ConstructorInfo ? "C" : "M";
            string methodName = methodBase is ConstructorInfo ? string.Empty : "." + methodBase.Name;
            var result = $"{prefix}_{typePart}{methodName}{suffix}.html";
            return result;
        }

        /// <summary>
        /// Provides the filename for a property element.
        /// </summary>
        public string Filename(PropertyInfo property) => $"P_{FilenamePartForMainType(property.DeclaringType)}.{property.Name}.html";

        private string ParametersFilename(ParameterInfo[] parameters)
        {
            string result = string.Join(",", parameters.Select(p => FilenamePartForParameter(p.ParameterType)));
            if (result.Length > 100) {
                // prevent too long filenames
                result = GetMD5Hash(result);
            }

            return result;
        }

        private static string GetMD5Hash(string text)
        {
            byte[] hash;
            using (MD5 md5 = MD5.Create())
            {
                hash = md5.ComputeHash(Encoding.UTF8.GetBytes(text));
            }

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("x2"));
            }

            return sb.ToString();
        }

        private string FilenamePartForMainType(Type type)
        {
            if (type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                type = type.GetGenericTypeDefinition();
            }

            return type.FullName;
        }

        private string FilenamePartForParameter(Type parameterType)
        {
            if (parameterType.IsGenericType)
            {
                Type[] genericArguments = parameterType.GetGenericArguments();
                // FIX: do not use Member here
                string genericType = parameterType.GetGenericTypeDefinition().FullName.Split('`')[0];
                return genericType + "`" + string.Join(",", genericArguments.Select(FilenamePartForParameter));
            }
            else
            {
                // FIX: do not use Member here
                return SystemTypes.Alias(parameterType) ?? parameterType.FullName;
            }
        }
    }
}
