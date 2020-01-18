using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Helper class that performs FTP operations.
	/// </summary>
	public class FTPHelper
	{
		/// <summary>
		/// Initializes an instance of this class.
		/// </summary>
		/// <param name="username">The username of the FTP connection.</param>
		/// <param name="password">The password of the FTP connection.</param>
		/// <param name="logger">A logging interface to use.</param>
		public FTPHelper(string username, string password, ILogger logger = null)
		{
			Username = username;
			Password = password;
			Logger = logger ?? new NullLogger();
		}

		/// <summary>
		/// Gets or sets the username of the FTP connection.
		/// </summary>
		public string Username { get; set; }

		/// <summary>
		/// Gets or sets the password of the FTP connection.
		/// </summary>
		public string Password { get; set; }

		/// <summary>
		/// Gets the logging component to use.
		/// </summary>
		public ILogger Logger { get; private set; }

		/// <summary>
		/// Uploads a local file to a remote FTP server.
		/// </summary>
		/// <param name="localFile">The local file to upload.</param>
		/// <param name="remoteUri">The FTP URI of the destination.</param>
		/// <param name="overwriteCondition">Defines the condition under which the remote file will be overwritten if it exists.
		/// Default value if <see cref="OverwriteCondition.DifferentSizeOrMoreRecentLocalFile"/>.</param>
		public FtpStatusCode UploadFile(string localFile, string remoteUri, OverwriteCondition overwriteCondition)
		{
			LocalFileInfo localFileInfo = new LocalFileInfo(localFile);
			FtpFileInfo ftpFileInfo = new FtpFileInfo(new FtpWebRequestFactory { Username = Username, Password = Password }, remoteUri, Logger);

			Logger.Info(string.Format("UploadFile. {0} to {1}, overwrite condition={2}", localFileInfo.Name, remoteUri, overwriteCondition));

			if (!ShouldUpload(overwriteCondition, localFileInfo, ftpFileInfo))
			{
				return FtpStatusCode.CommandOK;
			}

			FtpStatusCode result = localFileInfo.CopyTo(ftpFileInfo);

			Logger.Info(string.Format("Uploaded {0} to {1}, result {2}", localFileInfo.Name, remoteUri, (int)result));

			return result;
		}

		private static bool ShouldUpload(OverwriteCondition overwriteCondition, LocalFileInfo localFileInfo, FtpFileInfo ftpFileInfo)
		{
			bool shouldUpload;

			switch (overwriteCondition)
			{
				case OverwriteCondition.Always:
					shouldUpload = true;
					break;
				case OverwriteCondition.DifferentSize:
					shouldUpload = ftpFileInfo.Length != localFileInfo.Length;
					break;
				case OverwriteCondition.DifferentSizeOrMoreRecentLocalFile:
					shouldUpload = ftpFileInfo.Length != localFileInfo.Length || ftpFileInfo.LastWriteTimeUtc < localFileInfo.LastWriteTimeUtc;
					break;
				case OverwriteCondition.MoreRecentLocalFile:
					shouldUpload = ftpFileInfo.LastWriteTimeUtc < localFileInfo.LastWriteTimeUtc;
					break;
				case OverwriteCondition.Never:
					shouldUpload = !ftpFileInfo.Exists;
					break;
				default:
					throw new NotSupportedException(string.Format("Overwrite Condition {0} not supported", overwriteCondition));
			}

			return shouldUpload;
		}

		/// <summary>
		/// Creates a directory on an FTP server.
		/// </summary>
		/// <param name="remoteFolderUri">The FTP URI of the directory.</param>
		public FtpStatusCode CreateDirectory(string remoteFolderUri)
		{
			FtpDirectoryInfo ftpDirectoryInfo = new FtpDirectoryInfo(
				new FtpWebRequestFactory { Username = Username, Password = Password },
				remoteFolderUri,
				Logger);
			return ftpDirectoryInfo.Create();
		}

		/// <summary>
		/// Returns all the folder URIs of the given folder URI.
		/// </summary>
		/// <param name="remoteUri"></param>
		/// <returns></returns>
		/// <example>
		/// For a URI ftp://myhost.com/somepath/some-other-path/my-file.jpg
		/// This method will return two URIs:
		/// ftp://myhost.com/somepath
		/// and
		/// ftp://myhost.com/somepath/some-other-path
		/// </example>
		private IEnumerable<string> GetRemoteFolderUris(string remoteUri)
		{
			// ftp://myhost.com/somepath/some-other-path/my-file.jpg

			if (remoteUri == null)
			{
				throw new ArgumentNullException("remoteUri");
			}

			if (!remoteUri.StartsWith("ftp://"))
			{
				throw new ArgumentException("URI should start with ftp://", "remoteUri");
			}

			if (remoteUri.EndsWith("/"))
			{
				throw new ArgumentException("URI cannot end with /", "remoteUri");
			}

			string[] parts = remoteUri.Split(new[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
			if (parts != null && parts.Length > 3)
			{
				// otherwise, nothing to do because it's like ftp://myhost.com/my-file.jpg
				string[] folderParts = parts
					.Skip(2) // skip "ftp:" and "myhost.com"
					.Take(parts.Length - 3) // take "somepath", "some-other-path", but skip "my-file.jpg"
					.ToArray();

				for (int i = 0; i < folderParts.Length; i++)
				{
					string remoteFolderUri = "ftp://" + parts[1];
					for (int j = 0; j <= i; j++)
					{
						remoteFolderUri += "/" + folderParts[j];
					}

					yield return remoteFolderUri;
				}
			}
		}

		/// <summary>
		/// Ensures that the folders needed to upload the given file URIs exist on the remote server.
		/// </summary>
		/// <param name="remoteFileUris">A collection of file URIs.</param>
		/// <remarks>
		/// This method attempts to create every folder and supresses all exceptions during that process.
		/// </remarks>
		public FtpStatusCode EnsureFolders(IEnumerable<string> remoteFileUris)
		{
			FtpStatusCode status = FtpStatusCode.CommandOK; // Not disputed yet
			foreach (string remoteFolderUri in remoteFileUris.SelectMany(remoteFileUri => GetRemoteFolderUris(remoteFileUri)).Distinct())
			{
				FtpStatusCode statusStep = CreateDirectory(remoteFolderUri);
				if (statusStep != FtpStatusCode.CommandOK)
				{
					status = statusStep;
				}
			}
			return status;
		}

		/// <summary>
		/// Uploads a number of files to a remote server.
		/// </summary>
		/// <param name="fileMappings">
		/// A collection of file mappings to upload. 
		/// </param>
		/// <param name="overwriteCondition">The overwrite condition to use when uploading</param>
		public FtpStatusCode UploadFiles(IEnumerable<FileMapping> fileMappings, OverwriteCondition overwriteCondition)
		{
			FtpStatusCode status = FtpStatusCode.CommandOK; // Not disputed yet
			foreach (FileMapping fileMapping in fileMappings)
			{
				FtpStatusCode statusStep = UploadFile(fileMapping.LocalFile, fileMapping.RemoteUri, overwriteCondition);
				if (statusStep != FtpStatusCode.CommandOK)
				{
					status = statusStep;
				}
			}
			return status;
		}
	}
}
