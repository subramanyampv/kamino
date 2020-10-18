using System;
using System.Reflection;

namespace IglooCastle.Core
{
    static class FilenameProviderExtensions
    {
        public static string Filename(this Type type)
        {
            return new FilenameProvider().Filename(type);
        }

        public static string Filename(this ConstructorInfo constructor)
        {
            return new FilenameProvider().Filename(constructor);
        }
    }
}
