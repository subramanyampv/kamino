using System;
using System.IO;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Holds file information about a file that resides in a remote FTP server.
	/// </summary>
	public class FtpFileInfo : FtpInfoBase, IFileInfo
	{
		private long? _length;
		private DateTime? _lastWriteTimeUtc;

		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="ftpWebRequestFactory">A factory for <see cref="FtpWebRequest"/> instances.</param>
		/// <param name="url">The FTP url of the file.</param>
		/// <param name="logger">The logging component.</param>
		public FtpFileInfo(FtpWebRequestFactory ftpWebRequestFactory, string url, ILogger logger)
			: base(ftpWebRequestFactory, url, logger)
		{
		}

		/// <summary>
		/// Gets the length of the file in bytes.
		/// </summary>
		public long Length
		{
			get
			{
				if (_length.HasValue)
				{
					return _length.Value;
				}

				long result = GetLength();
				if (result >= 0)
				{
					// don't cache negative result, that's an error
					_length = result;
				}

				return result;
			}
		}

		/// <summary>
		/// Gets the date when the file was last written to.
		/// </summary>
		public DateTime LastWriteTimeUtc
		{
			get
			{
				if (_lastWriteTimeUtc.HasValue)
				{
					return _lastWriteTimeUtc.Value;
				}

				DateTime result = GetLastWriteTimeUtc();
				if (result > DateTime.MinValue)
				{
					// don't cache MinValue, that's an error
					_lastWriteTimeUtc = result;
				}

				return result;
			}
		}

		/// <summary>
		/// Gets a value indicating whether the file exists or not.
		/// </summary>
		public bool Exists { get { return Length >= 0; } }

		/// <summary>
		/// Writes data in the file. The data are written in a stream.
		/// </summary>
		/// <param name="streamWriter">A method to actually write the data.</param>
		/// <param name="contentLength">The length, in bytes, of the content that will be written.</param>
		public FtpStatusCode Write(Action<Stream> streamWriter, long contentLength)
		{
			return Run(() =>
			{

				FtpWebRequest request = FtpWebRequestFactory.CreateFtpWebRequest(Url);
				request.Method = WebRequestMethods.Ftp.UploadFile;
				request.UseBinary = true;
				request.ContentLength = contentLength;

				// write into the upload stream.
				Stream requestStream = request.GetRequestStream();
				streamWriter(requestStream);
				requestStream.Close();

				return request;
			}, "Error uploading to");
		}

		/// <summary>
		/// Copies this file's contents to the destination file.
		/// The destination file will be overwritten if it already exists.
		/// </summary>
		/// <param name="destinationFile">The destination file.</param>
		/// <remarks>This method is currently not implemented.</remarks>
		public FtpStatusCode CopyTo(IFileInfo destinationFile)
		{
			throw new NotImplementedException();
		}

		/// <summary>
		/// Deletes a file.
		/// </summary>
		public FtpStatusCode Delete()
		{
			return Run(() =>
			{
				FtpWebRequest request = FtpWebRequestFactory.CreateFtpWebRequest(Url);
				request.Method = WebRequestMethods.Ftp.DeleteFile;
				return request;
			}, "Could not delete");
		}

		private DateTime GetLastWriteTimeUtc()
		{
			return Run(
				() =>
				{
					FtpWebRequest request = FtpWebRequestFactory.CreateFtpWebRequest(Url);
					request.Method = WebRequestMethods.Ftp.GetDateTimestamp;
					return request;
				},
			response => response.LastModified,
			DateTime.MinValue,
			"Could not get last write time for");
		}

		private long GetLength()
		{
			return Run(
				() => {
					FtpWebRequest request = FtpWebRequestFactory.CreateFtpWebRequest(Url);
					request.Method = WebRequestMethods.Ftp.GetFileSize;
					return request;
				},
				response => response.ContentLength,
				-1,
				"Could not get length of");
		}
	}
}
