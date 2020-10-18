using System.IO;
using System.Net;
using System.Web;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Validates documents against online w3c validation services.
	/// </summary>
	public class W3CValidator
	{
		/// <summary>
		/// Performs HTML validation of the contents of the given URL.
		/// </summary>
		/// <param name="url">The URL to validate.</param>
		/// <returns>An object containing the validation results.</returns>
		public W3CValidationResult ValidateHtml(string url)
		{
			string serviceUrl = string.Format("http://validator.w3.org/check?uri={0}", HttpUtility.UrlEncode(url));
			return CallService(serviceUrl);
		}

		/// <summary>
		/// Performs CSS3 validation of the contents of the given URL.
		/// </summary>
		/// <param name="url">The URL to validate.</param>
		/// <returns>An object containing the validation results.</returns>
		public W3CValidationResult ValidateCss(string url)
		{
			return ValidateCss(url, "css3");
		}

		/// <summary>
		/// Performs CSS validation of the contents of the given URL.
		/// </summary>
		/// <param name="url"></param>
		/// <param name="profile"></param>
		/// <returns></returns>
		public W3CValidationResult ValidateCss(string url, string profile)
		{
			return ValidateCss(url, profile, false);
		}

		/// <summary>
		/// Validate the CSS
		/// </summary>
		public W3CValidationResult ValidateCss(string url, string profile, bool vendorExtensionsAsWarnings)
		{
			string serviceUrl = string.Format(
				"http://jigsaw.w3.org/css-validator/validator?profile={0}&vextwarning={1}&uri={2}",
				profile,
				vendorExtensionsAsWarnings ? "true" : "false",
				HttpUtility.UrlEncode(url));
			return CallService(serviceUrl);
		}

		private W3CValidationResult CallService(string serviceUrl)
		{
			WebRequest request = WebRequest.Create(serviceUrl);
			WebResponse response = null;
			W3CValidationResult result = new W3CValidationResult();

			try
			{
				try
				{
					response = request.GetResponse();
					if (response != null && response.Headers != null)
					{
						int errors;
						if (int.TryParse(response.Headers.Get("X-W3C-Validator-Errors"), out errors))
						{
							result.Errors = errors;
						}

						result.IsValid = "Valid" == response.Headers.Get("X-W3C-Validator-Status");
					}
					else
					{
						result.IsValid = false;
						result.IsServerError = true;
					}
				}
				catch (WebException ex)
				{
					response = ex.Response;
					result.IsServerError = true;
				}

				if (response != null)
				{
					Stream s = response.GetResponseStream();
					StreamReader srOutput = new StreamReader(s);
					result.HtmlResponse = srOutput.ReadToEnd();
				}
			}
			finally
			{
				response.SafeDispose();
			}

			return result;
		}
	}
}
