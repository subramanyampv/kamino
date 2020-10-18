namespace NGSoftware.Common.Configuration
{
    /// <summary>
    /// An AppSettings filter provider that converts parameter names to UPPER_CASE.
    /// </summary>
    public class UppercaseParameterConverter : IAppSettings
    {
        private readonly IAppSettings _backend;

        public UppercaseParameterConverter(IAppSettings backend)
        {
            _backend = backend;
        }

        public string this[string parameterName] => _backend[Convert(parameterName)];

        private static string Convert(string parameterName)
        {
            string result = "";
            for (var i = 0; i < parameterName.Length; i++)
            {
                var ch = parameterName[i];
                if (ch == '.')
                {
                    // add an underscore but not two in a row
                    if (i > 0 && result[i - 1] != '_')
                    {
                        result += '_';
                    }
                }
                else if (ch >= 'A' && ch <= 'Z')
                {
                    if (i > 0 && result[i - 1] != '_')
                    {
                        result += '_';
                    }

                    result += ch;
                }
                else
                {
                    result += char.ToUpperInvariant(ch);
                }
            }

            return result;
        }
    }
}