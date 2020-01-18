using System;
using NAnt.Core;
using NAnt.Core.Attributes;
using System.Diagnostics;
using System.IO;

namespace W3CValidationTasks
{
	/// <summary>
	/// Runs a .NET executable on Windows or on Unix with mono.
	/// The task name in NAnt is <c>dotnetexec</c>.
	/// </summary>
	[TaskName("dotnetexec")]
	public class DotNetExecuteTask : ExternalProgramTaskBase
	{
		/// <summary>
		/// Gets or sets the program to execute.
		/// In a NAnt build file, the attribute name is <c>program</c>.
		/// </summary>
		[TaskAttribute("program", Required = true)]
		public virtual string Program
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the working directory.
		/// In a NAnt build file, the attribute name is <c>workingdir</c>.
		/// </summary>
		[TaskAttribute("workingdir")]
		public virtual string WorkingDirectory
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the command line arguments.
		/// In a NAnt build file, the attribute name is <c>commandline</c>.
		/// </summary>
		[TaskAttribute("commandline")]
		public virtual string CommandLine
		{
			get;
			set;
		}

		/// <summary>
		/// Creates a process start info suitable for .NET and Mono.
		/// </summary>
		/// <returns>The process start info.</returns>
		protected override ProcessStartInfo CreateProcessStartInfo()
		{
			string absoluteProgramPath = GetAbsoluteProgram();

			ProcessStartInfo psi;
			if (IsUnix())
			{
				Log(Level.Info, "Starting program {0} with mono", absoluteProgramPath);
				psi = new ProcessStartInfo("mono", absoluteProgramPath + " " + CommandLine);
			}
			else
			{
				Log(Level.Info, "Starting program {0} on Windows", absoluteProgramPath);
				psi = new ProcessStartInfo(absoluteProgramPath, CommandLine);
			}

			psi.WorkingDirectory = WorkingDirectory;
			return psi;
		}

		private string GetAbsoluteProgram()
		{
			if (string.IsNullOrWhiteSpace(Program))
			{
				throw new BuildException("Program was not given");
			}

			if (!File.Exists(Program))
			{
				throw new BuildException(string.Format("Program {0} not found.", Program));
			}

			return Path.GetFullPath(Program);
		}
	}
}
