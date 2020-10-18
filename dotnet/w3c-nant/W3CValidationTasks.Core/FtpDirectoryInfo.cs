using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Holds information about a directory that resides on a remote FTP server.
	/// </summary>
	public class FtpDirectoryInfo : FtpInfoBase, IDirectoryInfo
	{
		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="ftpWebRequestFactory">A factory for <see cref="FtpWebRequest"/> instances.</param>
		/// <param name="url">The FTP url of the directory.</param>
		/// <param name="logger">The logging component.</param>
		public FtpDirectoryInfo(FtpWebRequestFactory ftpWebRequestFactory, string url, ILogger logger)
			: base(ftpWebRequestFactory, url, logger)
		{
		}

		/// <summary>
		/// Creates the directory represented by this object.
		/// </summary>
		public FtpStatusCode Create()
		{
			return Run(() =>
			{
				FtpWebRequest request = FtpWebRequestFactory.CreateFtpWebRequest(Url);
				request.Method = WebRequestMethods.Ftp.MakeDirectory;
				return request;
			}, errorMessage: "Error creating folder");
		}
	}
}
