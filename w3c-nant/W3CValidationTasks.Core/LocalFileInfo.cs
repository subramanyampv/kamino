using System;
using System.IO;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Holds file information about a local file.
	/// </summary>
	/// <remarks>
	/// This class wraps around the standard <see cref="FileInfo"/> class.
	/// </remarks>
	public class LocalFileInfo : IFileInfo
	{
		private readonly string _file;
		private readonly FileInfo _fileInfo;

		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="file">The full path of the file.</param>
		public LocalFileInfo(string file)
		{
			_file = file;
			_fileInfo = new FileInfo(file);
		}

		/// <summary>
		/// Gets the length of the file in bytes.
		/// </summary>
		public long Length { get { return _fileInfo.Length; } }

		/// <summary>
		/// Gets the name of the file.
		/// </summary>
		public string Name { get { return _fileInfo.Name; } }

		/// <summary>
		/// Gets a value indicating whether the file exists or not.
		/// </summary>
		public bool Exists { get { return _fileInfo.Exists; } }

		/// <summary>
		/// Gets the date when the file was last written to.
		/// </summary>
		public DateTime LastWriteTimeUtc { get { return _fileInfo.LastWriteTimeUtc; } }

		/// <summary>
		/// Writes data in the file. The data are written in a stream.
		/// </summary>
		/// <param name="streamWriter">A method to actually write the data.</param>
		/// <param name="contentLength">The length, in bytes, of the content that will be written.</param>
		public FtpStatusCode Write(Action<Stream> streamWriter, long contentLength)
		{
			using (FileStream fs = new FileStream(_fileInfo.FullName, FileMode.Create, FileAccess.Write, FileShare.None))
			{
				streamWriter(fs);
			}
			return FtpStatusCode.CommandOK;
		}

		/// <summary>
		/// Copies this file's contents to the destination file.
		/// The destination file will be overwritten if it already exists.
		/// </summary>
		/// <param name="destinationFile">The destination file.</param>
		/// <remarks>
		/// If the destination file is also a local file, the simple approach of using <see cref="File.Copy(string,string)"/> is used.
		/// Otherwise, the <see cref="Write"/> method is used to copy the local file's stream on the destination file.
		/// </remarks>
		public FtpStatusCode CopyTo(IFileInfo destinationFile)
		{
			FtpStatusCode status;
			if (destinationFile is LocalFileInfo)
			{
				// take a shortcut
				File.Copy(_file, ((LocalFileInfo)destinationFile)._file, true);
				status = FtpStatusCode.CommandOK;
			}
			else
			{
				// go the normal way
				using (FileStream fs = new FileStream(_file, FileMode.Open, FileAccess.Read, FileShare.Read))
				{
					status = destinationFile.Write(destinationStream => fs.CopyTo(destinationStream), Length);
				}
			}
			return status;
		}

		/// <summary>
		/// Deletes a file.
		/// </summary>
		public FtpStatusCode Delete()
		{
			_fileInfo.Delete();
			return FtpStatusCode.CommandOK;
		}
	}
}
