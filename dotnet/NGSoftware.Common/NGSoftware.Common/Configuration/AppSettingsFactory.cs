namespace NGSoftware.Common.Configuration
{
    /// <summary>
    /// Provides frequently used AppSettings providers.
    /// </summary>
    public static class AppSettingsFactory
    {
        /// <summary>
        /// Creates an AppSettings provider that checks the environment
        /// variables for settings and falls back to the app.config file.
        /// Key names are converted to UPPER_CASE when looking up environment variables.
        /// </summary>
        /// <returns></returns>
        public static IAppSettings DefaultWithEnvironmentOverride()
        {
            return new AppSettingsComposite(
                new IAppSettings[]
                {
                    new UppercaseParameterConverter(new AppSettingsEnvironmentVariables())
                }
            );
        }
    }
}