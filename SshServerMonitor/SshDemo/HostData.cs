using System;
using System.Linq;

namespace SshDemo
{
    [Serializable]
    public class HostData
    {
        private string[] _logFiles;

        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PrivateKeyFile { get; set; }
        public string[] LogFiles
        {
            get { return _logFiles ?? (_logFiles = new string[0]); }
            set { _logFiles = (value ?? Enumerable.Empty<string>()).Where(s => !string.IsNullOrWhiteSpace(s)).ToArray(); }
        }
    }
}
