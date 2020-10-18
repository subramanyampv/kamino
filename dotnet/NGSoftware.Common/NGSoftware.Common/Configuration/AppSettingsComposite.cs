using System.Collections.Generic;
using System.Linq;

namespace NGSoftware.Common.Configuration
{
	/// <summary>
	/// Composite AppSettings provider. Combines multiple sources.
	/// </summary>
	public class AppSettingsComposite : IAppSettings
	{
		private readonly ICollection<IAppSettings> _settings;
		
		public AppSettingsComposite(ICollection<IAppSettings> settings)
		{
			_settings = settings;
		}

		public string this[string parameterName]
			=> _settings.Select(s => s[parameterName]).FirstOrDefault(s => s != null);
	}
}
