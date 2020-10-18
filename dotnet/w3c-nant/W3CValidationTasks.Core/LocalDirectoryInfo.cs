using System.IO;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Holds information about a directory that resides on the local file system.
	/// </summary>
	public class LocalDirectoryInfo : IDirectoryInfo
	{
		private readonly string _path;
		private readonly DirectoryInfo _directoryInfo;

		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="path">The full path of the directory.</param>
		public LocalDirectoryInfo(string path)
		{
			_path = path;
			_directoryInfo = new DirectoryInfo(path);
		}

		/// <summary>
		/// Creates the directory represented by this object.
		/// </summary>
		public FtpStatusCode Create()
		{
			_directoryInfo.Create();
			return FtpStatusCode.CommandOK;
		}
	}
}
