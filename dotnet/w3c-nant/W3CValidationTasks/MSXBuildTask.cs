using System;
using System.Diagnostics;

using NAnt.Core;
using NAnt.Core.Attributes;

namespace W3CValidationTasks
{
	/// <summary>
	/// Runs msbuild or xbuild, depending on the OS.
	/// The task name in NAnt is <c>msxbuild</c>.
	/// </summary>
	[TaskName("msxbuild")]
	public class MSXBuildTask : ExternalProgramTaskBase
	{
		/// <summary>
		/// Gets or sets the active configuration to build.
		/// In a NAnt build file, the attribute name is <c>configuration</c>.
		/// </summary>
		[TaskAttribute("configuration")]
		public virtual string Configuration
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the solution file to build.
		/// In a NAnt build file, the attribute name is <c>solution</c>.
		/// </summary>
		[TaskAttribute("solution")]
		public virtual string Solution
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets any extra parameters to pass to the build.
		/// In a NAnt build file, the attribute name is <c>commandline</c>.
		/// </summary>
		[TaskAttribute("commandline")]
		public virtual string CommandLine
		{
			get;
			set;
		}

		/// <summary>
		/// Creates the process start info class that describes the program to start.
		/// </summary>
		/// <returns>The process start info.</returns>
		protected override ProcessStartInfo CreateProcessStartInfo()
		{
			string[] args = new[]
			{
				Solution,
				string.IsNullOrWhiteSpace(Configuration) ? string.Empty : "/p:Configuration=" + Configuration,
				CommandLine
			};

			ProcessStartInfo psi = new ProcessStartInfo(IsUnix() ? "xbuild" : "msbuild", string.Join(" ", args));
			psi.UseShellExecute = false;
			return psi;
		}
	}
}
