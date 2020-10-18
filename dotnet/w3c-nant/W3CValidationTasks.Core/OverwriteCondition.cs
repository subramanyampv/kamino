namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Defines the conditions that determine if a remote file will be overwritten by a local file during copy.
	/// </summary>
	public enum OverwriteCondition
	{
		/// <summary>
		/// Use the default behaviour.
		/// Currently this is the same as <see cref="OverwriteCondition.DifferentSizeOrMoreRecentLocalFile"/>
		/// </summary>
		Default = 0,

		/// <summary>
		/// The remote file will never be overwritten.
		/// </summary>
		Never,

		/// <summary>
		/// The remote file will always be overwritten.
		/// </summary>
		Always,

		/// <summary>
		/// The remote file will be overwritten if it has different size than the local file.
		/// </summary>
		DifferentSize,

		/// <summary>
		/// The remote file will be overwritten if it is older than the local file.
		/// </summary>
		MoreRecentLocalFile,

		/// <summary>
		/// The remote file will be overwritten if it has a different size than the local file,
		/// or if it is older than the local file.
		/// </summary>
		DifferentSizeOrMoreRecentLocalFile
	}
}
