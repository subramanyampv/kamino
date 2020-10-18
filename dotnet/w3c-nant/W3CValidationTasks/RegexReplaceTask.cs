using NAnt.Core;
using NAnt.Core.Attributes;
using System.Text.RegularExpressions;

namespace W3CValidationTasks
{
	/// <summary>
	/// Replaces text inside a file using a regular expression.
	/// </summary>
	/// <example>
	/// <code>
	/// 	&lt;regexreplace
	/// 		file="AssemblyInfo.cs"
	/// 		tofile="AssemblyInfo.new.cs"
	/// 		pattern="\d+"
	/// 		replacement="${new.value}" /&gt;
	/// </code>
	/// </example>
	[TaskName("regexreplace")]
	public class RegexReplaceTask : Task
	{
		/// <summary>
		/// Gets or sets the file to read.
		/// In the NAnt script, that's set with the <c>file</c> attribute.
		/// </summary>
		/// <value>
		/// The file to read.
		/// </value>
		[TaskAttribute("file", Required = true)]
		public virtual string File
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the destination file.
		/// In a NAnt build file, the attribute name is <c>tofile</c>.
		/// </summary>
		[TaskAttribute("tofile", Required = true)]
		public virtual string ToFile
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the regular expression pattern.
		/// In a NAnt build file, the attribute name is <c>pattern</c>.
		/// </summary>
		[TaskAttribute("pattern", Required = true)]
		public virtual string Pattern
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the replacement text.
		/// In a NAnt build file, the attribute name is <c>replacement</c>.
		/// </summary>
		[TaskAttribute("replacement", Required = true)]
		public virtual string Replacement
		{
			get;
			set;
		}

		/// <summary>
		/// Execute the task
		/// </summary>
		protected override void ExecuteTask()
		{
			string content = System.IO.File.ReadAllText(File);
			content = Regex.Replace(content, Pattern, Replacement);
			System.IO.File.WriteAllText(ToFile, content);
		}
	}
}
