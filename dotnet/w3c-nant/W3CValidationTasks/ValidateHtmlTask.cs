using NAnt.Core.Attributes;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Validate html task.
	/// </summary>
	/// <example>
	/// <code>
	/// 	&lt;validateHtml url="http://my-valid-page.com/" /&gt;
	/// </code>
	/// </example>
	[TaskName("validateHtml")]
	public class ValidateHtmlTask : W3CTaskBase
	{
		/// <summary>
		/// Get validation result
		/// </summary>
		protected override W3CValidationResult GetValidationResult()
		{
			W3CValidator validator = new W3CValidator();
			return validator.ValidateHtml(Url);
		}
	}
}

