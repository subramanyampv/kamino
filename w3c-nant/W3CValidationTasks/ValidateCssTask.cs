using NAnt.Core.Attributes;
using W3CValidationTasks.Core;

namespace W3CValidationTasks
{
	/// <summary>
	/// Validate css task.
	/// </summary>
	/// <example>
	/// This example shows how to validate a page against CSS3 allowing custom vendor extensions.
	/// <code>
	/// 	&lt;validateCss
	/// 		url="http://my-valid-page.com/"
	/// 		profile="css3"
	/// 		vendorExtensionsAsWarnings="true" /&gt;
	/// </code>
	/// </example>
	[TaskName("validateCss")]
	public class ValidateCssTask : W3CTaskBase
	{
		/// <summary>
		/// Gets or sets the CSS profile to use.
		/// </summary>
		/// <value>
		/// The profile.
		/// </value>
		[TaskAttribute("profile", Required = false)]
		public string Profile
		{
			get;
			set;
		}
		
		/// <summary>
		/// Gets or sets a value indicating whether vendor extensions will be allowed as warnings.
		/// </summary>
		/// <value>
		/// <c>true</c> if vendor extensions will be reported as warnings; <c>false</c> if vendor extensions will be reported as errors.
		/// </value>
		[TaskAttribute("vendorExtensionsAsWarnings", Required = false)]
		public bool VendorExtensionsAsWarnings
		{
			get;
			set;
		}

		/// <summary>
		/// Get the validation result
		/// </summary>
		protected override W3CValidationResult GetValidationResult()
		{
			W3CValidator validator = new W3CValidator();
			return validator.ValidateCss(Url, Profile, VendorExtensionsAsWarnings);
		}
	}
}

