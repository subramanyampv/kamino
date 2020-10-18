using NAnt.Core;
using NAnt.Core.Attributes;
using System.Net;
using System.Text;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Base class for FTP tasks.
	/// </summary>
	public abstract class FtpTaskBase : Task, ILogger
	{
		/// <summary>
		/// Gets or sets the FTP host.
		/// In the NAnt script, that's set with the <c>host</c> attribute.
		/// </summary>
		/// <value>
		/// The FTP host.
		/// </value>
		[TaskAttribute("host", Required = true)]
		public string Host
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the username for the FTP connection.
		/// In the NAnt script, that's set with the <c>username</c> attribute.
		/// </summary>
		/// <value>
		/// The username.
		/// </value>
		[TaskAttribute("username", Required = true)]
		public string Username
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the password for the FTP connection.
		/// In the NAnt script, that's set with the <c>password</c> attribute.
		/// </summary>
		/// <value>
		/// The password.
		/// </value>
		[TaskAttribute("password", Required = true)]
		public string Password
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the name of a property in which the exit code of the program should be stored.
		/// Only of interest if failonerror is false.
		/// </summary>
		[TaskAttribute("resultproperty", Required = false)]
		public string ResultProperty { get; set; }

		/// <summary>
		/// Creates an FTP url from the given path parts.
		/// </summary>
		/// <param name="parts">A collection of path parts.</param>
		/// <returns>An FTP url</returns>
		/// <example>
		/// If parts contains "myhost.com", "photo.jpg"
		/// then this method returns ftp://myhost.com/photo.jpg
		/// </example>
		protected string GetFtpUrl(params string[] parts)
		{
			StringBuilder result = new StringBuilder();
			result.Append("ftp://");
			foreach (string part in parts)
			{
				string partWithoutSlashes = part.Trim('/');
				if (!string.IsNullOrEmpty(partWithoutSlashes))
				{
					if (result[result.Length - 1] != '/')
					{
						result.Append('/');
					}

					result.Append(partWithoutSlashes);
				}
			}

			return result.ToString();
		}

		/// <summary>
		/// Set the &quot;resultproperty&quot; if specified
		/// </summary>
		/// <param name="status"></param>
		private void SetResultProperty(FtpStatusCode status)
		{
			if (!string.IsNullOrEmpty(ResultProperty))
			{
				string statusString = ((int)status).ToString();
				if (Properties.Contains(ResultProperty))
				{
					Properties[ResultProperty] = statusString;
				}
				else
				{
					Properties.Add(ResultProperty, statusString);
				}
			}
		}

		/// <summary>
		/// After the task is complete, it logs the result of the FTP operation.
		/// </summary>
		/// <param name="status">The FTP operation status.</param>
		protected void HandleResult(FtpStatusCode status)
		{
			if (Verbose)
			{
				Log(Level.Info, "Completed with status " + (int)status);
			}

			SetResultProperty(status);
			if (status != FtpStatusCode.CommandOK && FailOnError)
			{
				throw new BuildException(string.Format("Error status: {0} - {1}", (int)status, status));
			}
		}

		#region ILogger members
		void ILogger.Debug(string message)
		{
			Log(Level.Debug, message);
		}

		void ILogger.Info(string message)
		{
			if (this.Verbose)
			{
				Log(Level.Info, message);
			}
		}

		void ILogger.Warn(string message)
		{
			Log(Level.Warning, message);
		}

		void ILogger.Error(string message)
		{
			Log(Level.Error, message);
		}
		#endregion
	}
}
