namespace W3CValidationTasks.Core
{
	/// <summary>
	/// The result of a validation retrieved from w3c online validation.
	/// </summary>
	public class W3CValidationResult
	{
		/// <summary>
		/// Gets or sets a value indicating whether the validation succeeded
		/// and the requested document was found valid.
		/// </summary>
		public bool IsValid
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the number of validation errors found.
		/// </summary>
		public int Errors
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets the HTML output of the validation service.
		/// This is the HTML output a user would see in the browser if the validation was done manually.
		/// </summary>
		public string HtmlResponse
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a value indicating whether validation failed due to a server error.
		/// </summary>
		/// <remarks>
		/// This will be <c>true</c> if a <see cref="System.Net.WebException"/> happened while using the
		/// W3C validation services.
		/// </remarks>
		public bool IsServerError
		{
			get;
			set;
		}
	}
}
