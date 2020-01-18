using NAnt.Core;
using NAnt.Core.Attributes;
using NAnt.Core.Types;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Ftp upload task. The usage should be familiar to the users of the built-in copy NAnt task.
	/// </summary>
	/// <example>
	/// This example shows how to upload multiple files to an FTP server.
	/// <code>
	/// 	&lt;ftpUpload host="ftp.myserver.com" username="root" password="r00t" todir="/"&gt;
	/// 		&lt;fileset basedir="dist"&gt;
	/// 			&lt;include name="**/*" /&gt;
	/// 			&lt;exclude name="**/*.config" /&gt;
	/// 		&lt;/fileset&gt;
	/// 	&lt;/ftpUpload&gt;
	/// </code>
	/// </example>
	[TaskName("ftpUpload")]
	public class FtpUploadTask : FtpTaskBase
	{
		/// <summary>
		/// Gets or sets the source file. If set, only this file will be copied.
		/// In the NAnt script, that's set with the <c>file</c> attribute.
		/// </summary>
		/// <value>
		/// The source file.
		/// </value>
		[TaskAttribute("file")]
		public virtual FileInfo SourceFile
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the destination file. Used in conjuction with <see cref="SourceFile"/>.
		/// In the NAnt script, that's set with the <c>tofile</c> attribute.
		/// </summary>
		/// <value>
		/// The destination file for a single file upload operation.
		/// </value>
		[TaskAttribute("tofile")]
		public virtual string ToFile
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the destination directory.
		/// In the NAnt script, that's set with the <c>todir</c> attribute.
		/// </summary>
		/// <value>
		/// The destination directory.
		/// </value>
		[TaskAttribute("todir")]
		public virtual string ToDirectory
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the file set to upload. This will be used only when the <see cref="SourceFile"/> isn't set.
		/// In the NAnt script, that's set with the <c>fileset</c> attribute.
		/// </summary>
		/// <value>
		/// The file set to upload.
		/// </value>
		[BuildElement("fileset")]
		public virtual FileSet CopyFileSet
		{
			get;
			set;
		}
		/// <summary>
		/// Gets or sets a value that determines under which condition
		/// remote files will be overwriten during upload.
		/// 
		/// In the NAnt script, that's set with the <c>overwritecondition</c> attribute.
		/// </summary>
		[TaskAttribute("overwritecondition")]
		public OverwriteCondition OverwriteCondition { get; set; }

		/// <summary>
		/// Execute the task
		/// </summary>
		protected override void ExecuteTask()
		{
			OverwriteCondition overwriteCondition = OverwriteCondition;

			// Note: this should have been a nullable, but it's not straight-forward how to convince NAnt to use it.
			if (overwriteCondition == Core.OverwriteCondition.Default)
			{
				overwriteCondition = Core.OverwriteCondition.DifferentSizeOrMoreRecentLocalFile;
			}

			if (CopyFileSet != null && CopyFileSet.BaseDirectory == null)
			{
				CopyFileSet.BaseDirectory = new DirectoryInfo(Project.BaseDirectory);
			}

			FTPHelper ftpHelper = new FTPHelper(Username, Password, this);

			FileMapping[] fileMappings = (SourceFile != null ? PrepareSingleFile() : PrepareMultipleFiles()).ToArray();

			// for every URL, make sure the folder exists
			ftpHelper.EnsureFolders(fileMappings.Select(pair => pair.RemoteUri));

			// upload files, without checking for folder existence
			FtpStatusCode status = ftpHelper.UploadFiles(fileMappings, overwriteCondition);

			HandleResult(status);
		}

		private IEnumerable<FileMapping> PrepareMultipleFiles()
		{
			return from string file in CopyFileSet.FileNames
				   let relativeFile = file.Substring(CopyFileSet.BaseDirectory.FullName.Length).Replace(Path.DirectorySeparatorChar, '/')
				   let remoteUri = GetFtpUrl(Host, ToDirectory, relativeFile)
				   select new FileMapping
				   {
					   LocalFile = file,
					   RemoteUri = remoteUri
				   };
		}

		private IEnumerable<FileMapping> PrepareSingleFile()
		{
			string remoteUri;
			if (!string.IsNullOrEmpty(ToFile))
			{
				remoteUri = GetFtpUrl(Host, ToFile);
			}
			else
			{
				remoteUri = GetFtpUrl(Host, ToDirectory, SourceFile.Name);
			}

			yield return new FileMapping
				{
					LocalFile = SourceFile.FullName,
					RemoteUri = remoteUri
				};
		}
	}
}
