using System;
using System.Diagnostics;
using NAnt.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Base class for tasks that run an external program.
	/// </summary>
	public abstract class ExternalProgramTaskBase : Task
	{
		/// <summary>
		/// Creates the process start info class that describes the program to start.
		/// </summary>
		/// <returns>The process start info.</returns>
		protected abstract ProcessStartInfo CreateProcessStartInfo();

		/// <summary>
		/// Executes the task.
		/// </summary>
		protected override void ExecuteTask()
		{
			ProcessStartInfo psi = CreateProcessStartInfo();
			int exitCode = Run(psi);
			if (exitCode != 0)
			{
				throw new BuildException(string.Format("Program {0} exit code was non zero: {1}", psi.FileName, exitCode));
			}
			else
			{
				Log(Level.Info, "Program {0} completed successfully", psi.FileName);
			}
		}

		/// <summary>
		/// Determines whether the OS is unix.
		/// </summary>
		/// <returns><c>true</c> if OS is unix; otherwise, <c>false</c>.</returns>
		protected bool IsUnix()
		{
			return Environment.OSVersion.Platform == PlatformID.MacOSX || Environment.OSVersion.Platform == PlatformID.Unix;
		}

		private int Run(ProcessStartInfo psi)
		{
			using (Process process = Process.Start(psi))
			{
				process.WaitForExit();
				return process.ExitCode;
			}
		}
	}
}
