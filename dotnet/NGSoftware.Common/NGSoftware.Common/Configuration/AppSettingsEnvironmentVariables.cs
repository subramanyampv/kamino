using System;

namespace NGSoftware.Common.Configuration
{
    /// <summary>
    /// AppSettings provider reading environment variables.
    /// </summary>
    public class AppSettingsEnvironmentVariables : IAppSettings
    {
        public string this[string parameterName] => Environment.GetEnvironmentVariable(parameterName);
    }
}