using System;
using System.IO;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Represents information over a file.
	/// The file may be a local file, remote file, virtual file, etc.
	/// </summary>
	public interface IFileInfo
	{
		/// <summary>
		/// Gets the length of the file in bytes.
		/// </summary>
		long Length { get; }

		/// <summary>
		/// Gets the date when the file was last written to.
		/// </summary>
		DateTime LastWriteTimeUtc { get; }

		/// <summary>
		/// Gets a value indicating whether the file exists or not.
		/// </summary>
		bool Exists { get; }

		/// <summary>
		/// Writes data in the file. The data are written in a stream.
		/// </summary>
		/// <param name="streamWriter">A method to actually write the data.</param>
		/// <param name="contentLength">The length, in bytes, of the content that will be written.</param>
		FtpStatusCode Write(Action<Stream> streamWriter, long contentLength);

		/// <summary>
		/// Copies this file's contents to the destination file.
		/// The destination file will be overwritten if it already exists.
		/// </summary>
		/// <param name="destinationFile">The destination file.</param>
		FtpStatusCode CopyTo(IFileInfo destinationFile);

		/// <summary>
		/// Deletes a file.
		/// </summary>
		FtpStatusCode Delete();
	}
}
