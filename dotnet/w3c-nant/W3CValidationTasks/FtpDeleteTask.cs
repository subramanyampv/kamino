using System.Net;
using NAnt.Core.Attributes;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Ftp delete task. Deletes a file on a remote FTP server.
	/// </summary>
	/// <example>
	/// <code>
	/// 	&lt;ftpDelete
	/// 		host="ftp.myserver.com"
	/// 		username="root"
	/// 		password="r00t"
	/// 		file="app_offline.htm" /&gt;
	/// </code>
	/// </example>
	[TaskName("ftpDelete")]
	public class FtpDeleteTask : FtpTaskBase
	{
		/// <summary>
		/// Gets or sets the file to delete.
		/// In the NAnt script, that's set with the <c>file</c> attribute.
		/// </summary>
		/// <value>
		/// The remote file to delete.
		/// </value>
		[TaskAttribute("file")]
		public virtual string File
		{
			get;
			set;
		}

		/// <summary>
		/// Execute the task
		/// </summary>
		protected override void ExecuteTask()
		{
			string url = GetFtpUrl(Host, File);
			FtpFileInfo ftpFileInfo = new FtpFileInfo(
				new FtpWebRequestFactory { Username = Username, Password = Password },
				url,
				this);

			FtpStatusCode status = ftpFileInfo.Delete();
			HandleResult(status);
		}
	}
}
