using System;
using System.Net;

namespace W3CValidationTasks.Core
{
	/// <summary>
	/// Extension methods for the <see cref="WebResponse"/> class.
	/// </summary>
	public static class WebResponseExtensions
	{
		/// <summary>
		/// Disposes of this web response supressing all errors that that might cause.
		/// </summary>
		/// <param name="webResponse">This web response.</param>
		public static void SafeDispose(this WebResponse webResponse)
		{
			if (webResponse != null)
			{
				try
				{
					webResponse.Close();
					((IDisposable)webResponse).Dispose();
				}
				catch { }
			}
		}
	}
}
