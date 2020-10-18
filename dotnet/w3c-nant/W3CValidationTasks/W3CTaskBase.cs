using NAnt.Core;
using NAnt.Core.Attributes;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Base class for the W3C validation tasks.
	/// </summary>
	public abstract class W3CTaskBase : Task
	{
		/// <summary>
		/// Gets or sets the URL to validate.
		/// In the NAnt script this is set with the <c>url</c> attribute and it is required.
		/// </summary>
		/// <value>
		/// The URL to validate.
		/// </value>
		[TaskAttribute("url", Required = true)]
		public string Url
		{
			get;
			set;
		}

		/// <summary>
		/// Get the validation result
		/// </summary>
		protected abstract W3CValidationResult GetValidationResult();

		#region implemented abstract members of NAnt.Core.Task

		/// <summary>
		/// Execute the task
		/// </summary>
		protected override void ExecuteTask()
		{
			W3CValidationResult result = GetValidationResult();
			if (result.IsValid)
			{
				Log(Level.Info, "{0}: Url {1} is valid", Name, Url);
			}
			else
			{
				if (result.IsServerError)
				{
					Log(Level.Warning, "{0}: W3C Server could not process css validation request for {1}", Name, Url);
				}
				else
				{
					if (FailOnError)
					{
						throw new BuildException(string.Format("{0}: Url {1} is invalid", Name, Url));
					}
					else
					{
						Log(Level.Error, "{0}: Url {1} is invalid", Name, Url);
					}
				}
			}
		}
		
		#endregion
	}
}

