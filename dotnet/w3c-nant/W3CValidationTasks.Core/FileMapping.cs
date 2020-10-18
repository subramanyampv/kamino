namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Maps a local file to a remote URI.
	/// </summary>
	public class FileMapping
	{
		/// <summary>
		/// Gets or sets the local file.
		/// </summary>
		public string LocalFile { get; set; }

		/// <summary>
		/// Gets or sets the remote file's URI.
		/// </summary>
		public string RemoteUri { get; set; }
	}
}
