using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// A class that is capable of creating <see cref="FtpWebRequest"/> objects
	/// prefilled with the necessary credentials.
	/// </summary>
	public class FtpWebRequestFactory
	{
		/// <summary>
		/// Gets or sets the username of the FTP connection.
		/// </summary>
		public string Username { get; set; }

		/// <summary>
		/// Gets or sets the password of the FTP connection.
		/// </summary>
		public string Password { get; set; }

		/// <summary>
		/// Creates a new FTP web request.
		/// </summary>
		/// <param name="uri">The URL</param>
		/// <returns>A new FTP web request.</returns>
		public FtpWebRequest CreateFtpWebRequest(string uri)
		{
			FtpWebRequest request = (FtpWebRequest)WebRequest.Create(uri);
			request.Credentials = new NetworkCredential(Username, Password);
			return request;
		}
	}
}
