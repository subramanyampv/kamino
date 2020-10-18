using System;
using System.Threading.Tasks;

namespace SshDemo
{
    class LogCommand
    {
        public async Task<int[]> Run(IStateControllerHost host)
        {
            int[] result = new int[Enum.GetValues(typeof(LogLevel)).Length];
            string[] logFiles = host.SelectedHost.LogFiles;
            foreach (LogLevel logIndex in Enum.GetValues(typeof (LogLevel)))
            {
                result[(int)logIndex] = await Count(host, logIndex, logFiles);
            }

            return result;
        }

        private async Task<int> Count(IStateControllerHost host, LogLevel logLevel, string[] logFiles)
        {
            int result = 0;
            foreach (string logFile in logFiles)
            {
                result += await Count(host, logLevel, logFile);
            }

            return result;
        }

        private async Task<int> Count(IStateControllerHost host, LogLevel logLevel, string logFile)
        {
            string commandText = string.Format("grep {0} {1} | wc -l", logLevel.ToString().ToUpperInvariant(), logFile);
            var cmd = await host.Controller.RunCommand(commandText);
            return Convert.ToInt32(cmd.Result);
        }
    }
}
