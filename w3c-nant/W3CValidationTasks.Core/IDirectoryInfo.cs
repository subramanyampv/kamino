using System;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Holds information about a directory.
	/// The directory might be a local directory, a remote directory, a virtual directory, etc.
	/// </summary>
	public interface IDirectoryInfo
	{
		/// <summary>
		/// Creates the directory represented by this object.
		/// </summary>
		FtpStatusCode Create();
	}
}
