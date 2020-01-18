using System;
using System.Linq;

namespace NGSoftware.Common.Configuration
{
	/// <summary>
	/// AppSettings provider that reads command line arguments.
	/// </summary>
	public class AppSettingsCommandLineArgs : IAppSettings
	{
		public string this[string parameterName]
		{
			get
			{
				var args = Environment.GetCommandLineArgs();
				if (args == null)
				{
					return null;
				}

				string prefix = "-" + parameterName + "=";
				string arg = args.FirstOrDefault(a => a.StartsWith(prefix));
				if (arg == null)
				{
					return null;
				}

				return arg.Substring(prefix.Length);
			}
		}
	}
}
